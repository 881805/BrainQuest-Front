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
    this.findAllWithParams({ page: this.search.page, size: this.search.size}).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        if (Array.isArray(response)) {
          this.aiConfigListSignal.set(response);
          this.search = {...this.search, totalPages: 1};
          const totalPages = this.search.totalPages ?? 0;
          this.totalItems = Array.from({length: totalPages}, (_, i) => i+1);
        }
        else {
          console.error('Invalid response format:', response);
        }
      },
      
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }
  
  

  save(config: IAiConfiguration) {
    this.add(config).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the AI configuration', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(config: IAiConfiguration) {
    this.editCustomSource(`${config.id}`, config).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred updating the AI configuration', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  delete(config: IAiConfiguration) {
    this.delCustomSource(`${config.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', 'deleted', 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred deleting the AI configuration', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }
}
