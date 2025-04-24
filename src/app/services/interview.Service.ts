import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IGame, IMessage, IPreferenceList, IResponse, ISearch } from '../interfaces';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewService extends BaseService<IGame> {

  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  protected override source: string = 'interview';

  public search: ISearch = {
    page: 1,
    size: 5
  };
  public totalItems: any = [];

  private stompClient: any;

  constructor() {
    super();
  }

  save(game: IGame): Observable<IResponse<IGame>> {
    return this.add(game);
  }
}