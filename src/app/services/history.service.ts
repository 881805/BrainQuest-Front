import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IHistory, IResponse, ISearch } from '../interfaces';
import { AlertService } from './alert.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoryService extends BaseService<IHistory> {
  protected override source: string = 'history';
  private historyListSignal = signal<IHistory[]>([]);

  public get history$() {
    return this.historyListSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 15,
  };
  public totalItems: any = [];

  private alertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ?? 0 }, (_, i) => i + 1);
        this.historyListSignal.set(response.data);
      },
      error: (err) => {
        this.alertService.displayAlert('error', 'Error cargando historial', 'center', 'top', ['error-snackbar']);
        console.error('Error cargando historial', err);
      },
    });
  }
  
  getByGame(gameType: string, id: number): Observable<IResponse<IHistory>> {

    return this.findWithCustomSource(gameType, id);
  }
  
  
  save(history: IHistory): Promise<void> {
    return new Promise((resolve, reject) => {
      this.add(history).subscribe({
        next: (response: any) => {
          this.alertService.displayAlert('Success', 'Historial actualizado con éxito', 'center', 'top', ['success-snackbar']);
          this.getAll();
          resolve(); 
        },
        error: (err: any) => {
          this.alertService.displayAlert('error', 'Un error ocurrió agregando un registro al historial', 'center', 'top', ['error-snackbar']);
          console.error('Error adding history', err);
          reject(err); 
        }
      });
    });
  }
  
  update(history: IHistory) {
    this.editCustomSource(`${history.id}`, history).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('Historial actualizado con éxito', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Un error ocurrió actualizando un registro del historial', 'center', 'top', ['error-snackbar']);
        console.error('Error updating history', err);
      }
    });
  }
  
}
