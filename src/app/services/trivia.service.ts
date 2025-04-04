import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ITriviaQuestion, IResponse, ISearch } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriviaService extends BaseService<ITriviaQuestion> {
  private apiUrl = environment.apiUrl + '/trivia';
  private triviaQuestionsSignal = signal<ITriviaQuestion[]>([]);
  private alertService: AlertService = inject(AlertService);

  protected override source: string = 'trivia';
  
  get triviaQuestions$() {
    return this.triviaQuestionsSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 5
  };
  
  public totalItems: any = [];

  constructor(
    protected override http: HttpClient, 
    private snackBar: MatSnackBar
  ) {
    super();
  }

  getAll() {
    this.findAllWithParams(this.search).subscribe({
      next: (response: IResponse<ITriviaQuestion[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.triviaQuestionsSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error obteniendo preguntas de trivia', err);
      }
    });
  }

  generateTriviaQuestion(category: string, difficulty: string): Observable<ITriviaQuestion> {
    const body = { category, difficulty };

    return this.http.post<ITriviaQuestion>(`trivia/generate`, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(
      tap((response) => {
        this.snackBar.open('Pregunta generada con éxito', 'Cerrar', {
          duration: 2000
        });
      
        this.triviaQuestionsSignal.update(questions => [...questions, response]);
      }),
      catchError(error => {
        this.snackBar.open('Error al generar la pregunta de trivia', 'Cerrar', {
          duration: 3000
        });
        throw error;
      })
    );
  }

  getTriviaQuestions(category: string, difficulty: string): Observable<ITriviaQuestion[]> {
    return this.http.get<ITriviaQuestion[]>(`${this.apiUrl}?category=${category}&difficulty=${difficulty}`).pipe(
      tap((response) => {
        console.log('Preguntas obtenidas para categoría y dificultad', response);
        this.triviaQuestionsSignal.set(response); 
      }),
      catchError(error => {
        this.snackBar.open('Error al cargar las preguntas de trivia filtradas', 'Cerrar', {
          duration: 3000
        });
        throw error;
      })
    );
  }

  save(item: ITriviaQuestion) {
    this.add(item).subscribe({
      next: (response: IResponse<ITriviaQuestion>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Error al agregar la pregunta de trivia', 'center', 'top', ['error-snackbar']);
        console.error('Error al guardar pregunta', err);
      }
    });
  }

  update(item: ITriviaQuestion) {
    this.editCustomSource('', item).subscribe({
      next: (response: IResponse<ITriviaQuestion>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Error al actualizar la pregunta de trivia', 'center', 'top', ['error-snackbar']);
        console.error('Error al actualizar pregunta', err);
      }
    });
  }

  delete(item: ITriviaQuestion) {
    this.del(item.id).subscribe({
      next: (response: IResponse<ITriviaQuestion>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Error al eliminar la pregunta de trivia', 'center', 'top', ['error-snackbar']);
        console.error('Error al eliminar pregunta', err);
      }
    });
  }
}
