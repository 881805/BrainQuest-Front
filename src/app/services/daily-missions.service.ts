import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IGame, IMessage, IMissionXUser, IPreferenceList, IResponse, ISearch } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

import { environment } from '../../environments/environment';

import { catchError, firstValueFrom, Observable, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class DailyMissionService extends BaseService<IGame> {
  private missionSignal = signal<IMissionXUser[]>([]);
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  protected override source: string = 'missionsxusers';
  get dailyMissions$(): WritableSignal<IMissionXUser[]> {
    return this.missionSignal;
  }
  
  public search: ISearch = {
    page: 1,
    size: 5
  }
  public totalItems: any = [];
  
  constructor(){
    super();

  }
  

   assignMissions() {
    this.addCustomSource(`assign/${this.authService.getUser()?.id}`,{}).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('Success', 'Misiones Actualizadas', 'center', 'top', ['success-snackbar']);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Misiones no se pudieron actualizar','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }
  
  async getAllByUser() {
    this.findAllWithParamsAndCustomSource(`${this.authService.getUser()?.id}`).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.missionSignal.set(response.data);
        console.log("Updated DailyMissions:", this.missionSignal());
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }
    update(missionXUsers: IMissionXUser) {
    this.editCustomSource(`${missionXUsers.id}`, missionXUsers).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Progreso de mision no se pudo actualizar','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }
}
