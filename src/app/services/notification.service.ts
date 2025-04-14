import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertService } from './alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INotification, IResponse } from '../interfaces';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService<INotification> {
  private apiUrl = '/notifications';
  private alertService: AlertService = inject(AlertService);
  private snackBar = inject(MatSnackBar);
  private notificationSignal = signal<INotification[]>([]);

  protected override source: string = '/notifications';

  get notifications$() {
    return this.notificationSignal;
  }

  constructor(protected override http: HttpClient) {
    super();
  }

  getUserNotifications(userId: number): Observable<INotification[]> {
    return this.http.get<INotification[]>(`${this.apiUrl}/user/${userId}`).pipe(
      tap((notifs) => {
        this.notificationSignal.set(notifs);
      }),
      catchError((error) => {
        this.snackBar.open('Error al obtener notificaciones del usuario', 'Cerrar', { duration: 3000 });
        throw error;
      })
    );
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      tap(() => {
        this.snackBar.open('Notificación marcada como leída', 'Cerrar', { duration: 2000 });
      }),
      catchError((error) => {
        this.snackBar.open('Error al marcar la notificación como leída', 'Cerrar', { duration: 3000 });
        throw error;
      })
    );
  }

  createNotification(notification: INotification): Observable<IResponse<INotification>> {
    return this.http.post<IResponse<INotification>>(`${this.apiUrl}`, notification).pipe(
      tap((response) => {
        this.snackBar.open('Notificación creada con éxito', 'Cerrar', { duration: 2000 });
        this.notificationSignal.update(current => [response.data, ...current]);
      }),
      catchError((error) => {
        this.snackBar.open('Error al crear la notificación', 'Cerrar', { duration: 3000 });
        throw error;
      })
    );
  }


  onNewNotification(): Observable<INotification> {
   
    return new Observable<INotification>();
  }
}
