import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ILearningScenario, IResponse, ISearch } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LearningScenarioService extends BaseService<ILearningScenario> {
  private apiUrl = '/learning';
  private learningScenariosSignal = signal<ILearningScenario[]>([]);
  private alertService: AlertService = inject(AlertService);
  public loading: boolean = false;
  public currentScenario?: ILearningScenario;

  protected override source: string = '/learning';

  get learningScenarios$() {
    return this.learningScenariosSignal;
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
      next: (response: IResponse<ILearningScenario[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.learningScenariosSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error obteniendo escenarios de aprendizaje', err);
      }
    });
  }
  
  generateLearningScenario(topic: string): Observable<ILearningScenario> {
    const body = { topic }; 
  
    return this.http.post<ILearningScenario>(`learning/generate`, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(
      tap((response) => {
        const stored = localStorage.getItem('generatedScenarios');
        const generatedScenarios: ILearningScenario[] = stored ? JSON.parse(stored) : [];
  
        const alreadyExists = generatedScenarios.some(scenario =>
          scenario.story?.trim().toLowerCase() === response.story?.trim().toLowerCase()
        );
  
        if (alreadyExists) {
          this.snackBar.open('Ya has generado este escenario anteriormente', 'Cerrar', { duration: 3000 });
          return;
        }
  
        generatedScenarios.push(response);
        localStorage.setItem('generatedScenarios', JSON.stringify(generatedScenarios));
  
        this.snackBar.open('Escenario generado con éxito', 'Cerrar', { duration: 2000 });
  
        this.learningScenariosSignal.update(scenarios => [...scenarios, response]);
        this.currentScenario = response;
      }),
      catchError(error => {
        console.error('Error al generar escenario:', error);
        this.snackBar.open('Error al generar el escenario de aprendizaje', 'Cerrar', { duration: 3000 });
        throw error;
      })
    );
  }
  

  getLearningScenarios(topic: string): Observable<ILearningScenario[]> {
    if (!topic) {
      this.snackBar.open('Por favor, selecciona un tema', 'Cerrar', { duration: 3000 });
      return of([]);
    }
    return this.http.get<ILearningScenario[]>(`${this.apiUrl}?topic=${topic}`).pipe(
      tap((response) => {
        this.learningScenariosSignal.set(response); 
      }),
      catchError(error => {
        this.snackBar.open('Error al cargar los escenarios de aprendizaje', 'Cerrar', { duration: 3000 });
        throw error;
      })
    );
  }
  
  

  save(item: ILearningScenario) {
    this.add(item).subscribe({
      next: (response: IResponse<ILearningScenario>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Error al agregar el escenario de aprendizaje', 'center', 'top', ['error-snackbar']);
        console.error('Error al guardar escenario', err);
      }
    });
  }

  update(item: ILearningScenario) {
    this.editCustomSource('', item).subscribe({
      next: (response: IResponse<ILearningScenario>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Error al actualizar el escenario de aprendizaje', 'center', 'top', ['error-snackbar']);
        console.error('Error al actualizar escenario', err);
      }
    });
  }

  delete(item: ILearningScenario) {
    this.del(item.id).subscribe({
      next: (response: IResponse<ILearningScenario>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Error al eliminar el escenario de aprendizaje', 'center', 'top', ['error-snackbar']);
        console.error('Error al eliminar escenario', err);
      }
    });
  }

  generateScenario(topic: string, step: number): Observable<ILearningScenario> {
    const body = { topic, step };
    
    return this.http.post<ILearningScenario>(`learning/generate`, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(
      tap((response) => {
        this.snackBar.open('Escenario generado con éxito', 'Cerrar', {
          duration: 2000
        });

        this.learningScenariosSignal.update(scenarios => [...scenarios, response]);
      }),
      catchError(error => {
        this.snackBar.open('Error al generar el escenario', 'Cerrar', {
          duration: 3000
        });
        throw error;
      })
    );
  }

  submitAnswer(scenarioId: number, selectedOption: string): Observable<ILearningScenario> {
    const body = { scenarioId, selectedOption };
    
    return this.http.post<ILearningScenario>(`learning/generate`, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(
      tap((response) => {
        this.snackBar.open('Respuesta enviada con éxito', 'Cerrar', {
          duration: 2000
        });
      }),
      catchError(error => {
        this.snackBar.open('Error al enviar respuesta', 'Cerrar', {
          duration: 3000
        });
        throw error;
      })
    );
  }

  getAdditionalExplanation(scenario: ILearningScenario): Observable<string> {
    return of(`This is additional information about the topic: ${scenario.topic}`);
  }

  
  getAIFeedback(id: number, userAnswer: string): Observable<{ feedback: string, blockedOption: string }> {
    return this.http.post<{ feedback: string, blockedOption: string }>(
      `learning/feedback/${id}?userAnswer=${encodeURIComponent(userAnswer)}`, 
      {} 
    );
  }
  

  open(title: string, message: string): void {
    console.log(`Modal Opened: ${title} - ${message}`);
  }
}
