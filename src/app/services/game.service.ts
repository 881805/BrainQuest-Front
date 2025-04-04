import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IGame, IMessage, IPreferenceList, IResponse, ISearch } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';
import SockJS from 'sockjs-client';
import { environment } from '../../environments/environment';
import { Client } from "@stomp/stompjs";
import { catchError, Observable, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';



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
  
  constructor(){
    super();

  }

 
  async getAllByUser() {
    this.findAllWithParamsAndCustomSource(`${this.authService.getUser()?.id}`).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.gameSignal.set(response.data);
        console.log("Updated gameSignal:", this.gameSignal());
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  getAllByUserObservable(): Observable<IResponse<any[]>> {
    return this.findAllWithParamsAndCustomSource(`${this.authService.getUser()?.id}`).pipe(
        tap((response: IResponse<any[]>) => {
            this.search = { ...this.search, ...response.meta };
            this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
            this.gameSignal.set(response.data);
            console.log("Updated gameSignal:", this.gameSignal());
        }),
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occurred.';
            if (error.error instanceof ErrorEvent) {
                // Client-side errors
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side errors
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
            console.error(errorMessage);
            return of({ data: [], meta: [], message: errorMessage }); // meta is now an empty array
        })
    );
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
