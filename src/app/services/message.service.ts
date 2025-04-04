import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IMessage, IResponse } from '../interfaces';
import { Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { AlertService } from './alert.service';



 

@Injectable({
  providedIn: 'root',
})
export class MessageService extends BaseService<IMessage> {
  protected override source: string = 'messages';
  private userMessageSignal = signal<IMessage[]>([]);
  get messages$() {
    return this.userMessageSignal;
  }
  public search: ISearch = { 
    page: 1,
    size: 5
  }

  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  getAllByConversationId(conversationId : number) {
    this.findAllWithParams({ page: this.search.page, size: this.search.size, conversationId: conversationId}).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.userMessageSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

// private connectWebSocket() {
//   const socket = new SockJS('http://localhost:8080/ws');  // URL del servidor websocket
  
//   const stompClient = new Stomp.Client({
//     brokerURL: 'ws://localhost:8080/ws', //con protocolo de webasocket
//     onConnect: (frame: any) => {
//       console.log('Connected: ', frame);
//       stompClient.subscribe('/topic/messages', (message: { body: any; }) => {
//         console.log('Received message:', message.body);
//       });
//     },
//   });

//   this.stompClient.connect({}, (frame: any) => {
//     console.log('Connected: ' + frame);

//     this.stompClient.subscribe('/topic/messages', (message: any) => {
//       this.messageSubject.next(JSON.parse(message.body));
//     });
//   });
// }


// save(message: IMessage) {
//   this.stompClient.send('/app/chat', {}, JSON.stringify(message)); 
// }
// getMessages() {
//   return this.messageSubject.asObservable();
// }

save(message: IMessage): Observable<IResponse<IMessage>> {
  // You can reuse the add method here, passing the message data
  return this.add(message);
}


  

//   update(user: IUser) {
//     this.editCustomSource(`${user.id}`, user).subscribe({
//       next: (response: any) => {
//         this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
//         this.getAll();
//       },
//       error: (err: any) => {
//         this.alertService.displayAlert('error', 'An error occurred updating the user','center', 'top', ['error-snackbar']);
//         console.error('error', err);
//       }
//     });
//   }

//   delete(user: IUser) {
//     this.delCustomSource(`${user.id}`).subscribe({
//       next: (response: any) => {
//         this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
//         this.getAll();
//       },
//       error: (err: any) => {
//         this.alertService.displayAlert('error', 'An error occurred deleting the user','center', 'top', ['error-snackbar']);
//         console.error('error', err);
//       }
//     });
//   }
}
