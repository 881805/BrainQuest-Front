import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IGame, IPreferenceList, IResponse, ISearch } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GamesService extends BaseService<IGame> {
  private gameSignal = signal<IGame[]>([]);
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);
  protected override source: string = 'games';
  get game$() {
    return this.gameSignal;
  }
  public search: ISearch = {
    page: 1,
    size: 5
  }
  public totalItems: any = [];



  getAllByUser() {
    this.findAllWithParamsAndCustomSource(`${this.authService.getUser()?.id}`).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.gameSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  // save(item: IPreferenceList) {
  //   this.add(item).subscribe({
  //     next: (response: IResponse<IPreferenceList>) => {
  //       this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
  //       this.getAll();
  //     },
  //     error: (err: any) => {
  //       this.alertService.displayAlert('error', 'An error occurred adding the preference list', 'center', 'top', ['error-snackbar']);
  //       console.error('error', err);
  //     }
  //   });
  // }

  // update(item: IPreferenceList) {
  //   this.editCustomSource('', item).subscribe({
  //     next: (response: IResponse<IPreferenceList>) => {
  //       this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
  //       this.getAll();
  //     },
  //     error: (err: any) => {
  //       this.alertService.displayAlert('error', 'An error occurred updating the order', 'center', 'top', ['error-snackbar']);
  //       console.error('error', err);
  //     }
  //   });
  // }

  // delete(item: IPreferenceList) {
  //   this.del(item.id).subscribe({
  //     next: (response: IResponse<IPreferenceList>) => {
  //       this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
  //       this.getAll();
  //     },
  //     error: (err: any) => {
  //       this.alertService.displayAlert('error', 'An error occurred deleting the order', 'center', 'top', ['error-snackbar']);
  //       console.error('error', err);
  //     }
  //   });
  // }

}
