import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ITypingExercise, IResponse, ISearch } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypingService extends BaseService<ITypingExercise> {
  private apiUrl = environment.apiUrl + '/typing';
  private typingExercisesSignal = signal<ITypingExercise[]>([]);
  private alertService: AlertService = inject(AlertService);

  protected override source: string = 'typing';

  get typingExercises$() {
    return this.typingExercisesSignal;
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
      next: (response: IResponse<ITypingExercise[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.typingExercisesSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error obteniendo ejercicios de escritura', err);
      }
    });
  }

  generateTypingExercise(category: string, difficulty: string): Observable<ITypingExercise> {
    const body = { category, difficulty };

    return this.http.post<ITypingExercise>(`typing/generate`, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(
      tap((response) => {
        this.snackBar.open('Ejercicio generado con éxito', 'Cerrar', {
          duration: 2000
        });

        this.typingExercisesSignal.update(exercises => [...exercises, response]);
      }),
      catchError(error => {
        this.snackBar.open('Error al generar el ejercicio de escritura', 'Cerrar', {
          duration: 3000
        });
        throw error;
      })
    );
  }

  getTypingExercises(category: string, difficulty: string): Observable<ITypingExercise[]> {
    return this.http.get<ITypingExercise[]>(`?category=${category}&difficulty=${difficulty}`).pipe(
      tap((response) => {
        console.log('Ejercicios obtenidos para categoría y dificultad', response);
        this.typingExercisesSignal.set(response);
      }),
      catchError(error => {
        this.snackBar.open('Error al cargar los ejercicios de escritura filtrados', 'Cerrar', {
          duration: 3000
        });
        throw error;
      })
    );
  }

  save(item: ITypingExercise) {
    this.add(item).subscribe({
      next: (response: IResponse<ITypingExercise>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Error al agregar el ejercicio de escritura', 'center', 'top', ['error-snackbar']);
        console.error('Error al guardar ejercicio', err);
      }
    });
  }

  update(item: ITypingExercise) {
    this.editCustomSource('', item).subscribe({
      next: (response: IResponse<ITypingExercise>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Error al actualizar el ejercicio de escritura', 'center', 'top', ['error-snackbar']);
        console.error('Error al actualizar ejercicio', err);
      }
    });
  }

  delete(item: ITypingExercise) {
    this.del(item.id).subscribe({
      next: (response: IResponse<ITypingExercise>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Error al eliminar el ejercicio de escritura', 'center', 'top', ['error-snackbar']);
        console.error('Error al eliminar ejercicio', err);
      }
    });
  }
}
