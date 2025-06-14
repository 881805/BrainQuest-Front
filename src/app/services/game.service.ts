import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IGame, IMessage, IPreferenceList, IResponse, ISearch } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

import { environment } from '../../environments/environment';

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
  get game$(): WritableSignal<IGame[]> {
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

                errorMessage = `Error: ${error.error.message}`;
            } else {

                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
            console.error(errorMessage);
            return of({ id:null, data: [], meta: [], message: errorMessage }); // meta is now an empty array
        })
    );
}

}
