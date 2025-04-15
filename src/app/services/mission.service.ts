import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IMission, ISearch } from '../interfaces';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class MissionService extends BaseService<IMission> {
  protected override source: string = 'missions';
  private missionListSignal = signal<IMission[]>([]);

  get missions$() {
    return this.missionListSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 5,
  };
  public totalItems: any = [];

  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ?? 0 },
          (_, i) => i + 1
        );
        this.missionListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error loading missions', err);
      }
    });
  }

  save(mission: IMission) {
    this.add(mission).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the mission', 'center', 'top', ['error-snackbar']);
        console.error('Error adding mission', err);
      }
    });
  }

  update(mission: IMission) {
    this.editCustomSource(`${mission.id}`, mission).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred updating the mission', 'center', 'top', ['error-snackbar']);
        console.error('Error updating mission', err);
      }
    });
  }

  delete(mission: IMission) {
    this.delCustomSource(`${mission.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred deleting the mission', 'center', 'top', ['error-snackbar']);
        console.error('Error deleting mission', err);
      }
    });
  }
}
