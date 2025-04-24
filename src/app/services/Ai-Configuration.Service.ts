import { inject, Injectable, signal } from '@angular/core';
import { IAiConfiguration, ISearch } from '../interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AiConfigurationService extends BaseService<IAiConfiguration> {
  protected override source: string = 'ai-configurations';
  private _configurations = signal<IAiConfiguration[]>([]);
  private aiConfigListSignal = signal<IAiConfiguration[]>([]);
  
  // Getter público para la signal
  get configurations() {
    return this._configurations;
  }

  public search: ISearch = {
    page: 1,
    size: 5
  }
  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.http.get<IAiConfiguration[]>(`ai-configurations/list`).subscribe({
      next: (response: IAiConfiguration[]) => {
        console.log('Response:', response);
        this._configurations.set(response);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }
  
  

  save(config: IAiConfiguration) {
    this.add(config).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', 'Configuracion guardada con éxito', 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ha ocurrido un error salvando la configuración', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(config: IAiConfiguration) {
    this.editCustomSource(`${config.id}`, config).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success',  'Configuracion actualizada con éxito', 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ha ocurrido un error actualizando la configuración', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  delete(config: IAiConfiguration) {
    this.delCustomSource(`${config.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success',  'Configuracion borrada con éxito', 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ha ocurrido un error borrando la configuración', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }
}
