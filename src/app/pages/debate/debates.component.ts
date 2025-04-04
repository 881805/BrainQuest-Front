import { Component, inject, Input, OnDestroy, signal, ViewChild, WritableSignal } from '@angular/core';
import { GamesListComponent } from '../../components/games/game-list-component/games-list.component';
import { GamesService } from '../../services/game.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalService } from '../../services/modal.service';
import { IConversation, IGame, IMessage, IUser } from '../../interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DebateChatComponent } from '../../components/chat/chat.component';
import { CommonModule } from '@angular/common';
import { effect } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { io, Socket } from 'socket.io-client';
import { DebatesService } from '../../services/debate.service';
import { AlertService } from '../../services/alert.service';
import { firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-debates',
  standalone: true,
  imports: [
    GamesListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    DebateChatComponent,
    CommonModule
  ],
  templateUrl: './debates.component.html',
  styleUrls: ['./debates.component.scss'],
})
export class DebatesComponent implements OnDestroy  {
  public gamesService: GamesService = inject(GamesService);
  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  public messageService: MessageService = inject(MessageService);

  public debatesService: DebatesService = inject(DebatesService);

  public alertService: AlertService = inject(AlertService);
  
  private socket!: Socket;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private initialReconnectDelay = 1000; 
  private maxReconnectDelay = 30000; 
  
  @ViewChild('addOrdersModal') public addOrdersModal: any;
  @ViewChild(DebateChatComponent) chat!: DebateChatComponent;
  
  public fb: FormBuilder = inject(FormBuilder);
  orderForm = this.fb.group({
    id: [''],
    description: ['', Validators.required],
    total: ['', Validators.required],
  });

  public games : IGame[] = [];  
  public currentGame: IGame = {};

<<<<<<< Updated upstream
<<<<<<< Updated upstream
 

  saveMessage(message: IMessage){
    this.gamesService.sendMessage(this.currentGame.id ?? 1,message);
  }


=======
=======
>>>>>>> Stashed changes
  public messages: WritableSignal<IMessage[]> = signal([]);

// constructor() {
//   this.gamesService.getAllByUser();
  
// let token = localStorage.getItem('access_token') || '';
// console.log("Token used:", token); // Debugging

// // Check if the socket is already connected before reconnecting
// if (!this.socket || !this.socket.connected) {
//   this.socket = io('http://localhost:8081');
//   this.socket.on('connect', () => {
//     console.log('Connected to WebSocket');
//   });

//   this.socket.on('disconnect', () => {
//     console.log('Disconnected from WebSocket');
//   });
//   this.socket.on('message', (data: any) => {
//     console.log('Received:', data);
//   });
// }



constructor() {

  let response = this.gamesService.getAllByUser();
  if (!this.socket || !this.socket.connected) {
    this.socket = io('http://localhost:8081/chat', {
      transports: ['websocket']
    });

  this.socket.on('connect', () => {
    console.log('Connected to WebSocket');
    this.socket.emit('gameInfo', this.currentGame);
    this.reconnectAttempts = 0; // Reset attempts on successful connection
  });

  this.socket.on('disconnect', () => {
    console.log('Socket disconnected. Attempting reconnect...');
    this.reconnectWithBackoff();
  });
  this.socket.on('message', (data: any) => {
        console.log('Received:', data);
      });

      effect(() => {
        this.games = this.gamesService.game$();
      

        if (this.games.length === 0) {
          console.warn("No games available yet, waiting for API response...");
          return;
        }
        this.currentGame = this.games[0];
        this.messages.set(this.currentGame.conversation!.messages!);
      }, { allowSignalWrites: true });
      
        
  }
}
private reconnectWithBackoff() {
  if (this.reconnectAttempts >= this.maxReconnectAttempts) {
    console.error('Max reconnect attempts reached.');
    return;
  }

  const delay = Math.min(
    this.initialReconnectDelay * Math.pow(2, this.reconnectAttempts),
    this.maxReconnectDelay
  );

  setTimeout(() => {
    console.log(`Attempting reconnect in ${delay / 1000} seconds...`);
    this.socket.connect();
    this.reconnectAttempts++;
  }, delay);
}

ngOnDestroy(): void {
  if (this.socket) {
    this.socket.disconnect();
  }
}
  


public saveNewGame(){
  
}



async saveMessage(message: IMessage) {
  const user = this.authService.getUser() as IUser;

  const updatedMessage = {
      ...message,
      conversation: { id: this.currentGame.conversation?.id || 1 },
      user: { id: user.id }
  };

  try {
      this.currentGame.conversation?.messages?.push(message);
      this.currentGame = this.createGameRequest(this.currentGame);
      const response = await firstValueFrom(this.debatesService.save(this.currentGame));

      this.gamesService.getAllByUser();
  } catch (err) {
      console.error('Error saving message:', err);
      this.alertService.displayAlert('error', 'An error occurred while sending the message', 'center', 'top', ['error-snackbar']);
  }
}

  createGameRequest(game: IGame): IGame {
    const gameRequest: IGame = {
        id: game.id,
        conversation: game.conversation ? {
            id: game.conversation.id,
            messages: this.makeMessagesWithoutUser(game.conversation)
        } : null,
        winner: game.winner ? { id: game.winner.id } : undefined,
        question: game.question ? { id: game.question.id } : null,
        gameType: game.gameType ? { id: game.gameType.id } : undefined,
        isOngoing: game.isOngoing,
        pointsEarnedPlayer1: game.pointsEarnedPlayer1,
        pointsEarnedPlayer2: game.pointsEarnedPlayer2,
        expirationTime: game.expirationTime,
        timeLeft: game.timeLeft,
        maxTurns: game.maxTurns,
        elapsedTurns: game.elapsedTurns,
    };
    return gameRequest;
}
    //crea mensajes sin pasar el userid completo
  makeMessagesWithoutUser(conversation: IConversation): IMessage[] {
    const messageRequests: IMessage[] = [];
    const messages = conversation.messages ?? [];

    for (const message of messages) {
        const messageRequest: IMessage = {
            id: message.id || 1,
            createdAt: message.createdAt,
            conversation: { id: message.conversation?.id || 1 },
            contentText: message.contentText,
            user: { id: message.user.id },
            isSent: message.isSent,
        };
        messageRequests.push(messageRequest);
    }

    return messageRequests;
}
  async getReplyAI(game : IGame){
    try {
      const response = await this.debatesService.save(game).toPromise();
      console.log('Reply gotten successfully:', response);


      this.gamesService.getAllByUser();
    } catch (err) {
      console.error('Error getting reply:', err);
      this.alertService.displayAlert('error', 'An error occurred while getting the AI Reply','center', 'top', ['error-snackbar']);
      this.gamesService.getAllByUser();
    }
  }


//   async retryGetAllByUser() {
//     const maxAttempts = 5; // Adjust as needed
//     let attempts = 0;

//     while (attempts < maxAttempts) {
//         await this.gamesService.getAllByUser();
//         const updatedGames = this.gamesService.game$();

//         if (this.isGameDataUpdated(updatedGames)) {
//             console.log('Game data updated after retry.');
//             this.games = updatedGames;
//             return; // Exit retry loop
//         }

//         attempts++;
//         await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
//     }

//     console.error('Failed to get updated game data after multiple attempts.');
// }

// isGameDataUpdated(updatedGames: IGame[]): boolean {
//     // Implement your logic to check if the game data is updated
//     // For example, check if a specific message is present in the game's messages
//     const currentMessages = this.currentGame.conversation?.messages || [];
//     const updatedMessages = updatedGames[0]?.conversation?.messages || [];

//     if (currentMessages.length !== updatedMessages.length) {
//       this.games = this.gamesService.game$();
//       this.currentGame = this.games[0];
//       this.getReplyAI(this.createGameRequest(this.currentGame));  //crea un reply del ai para el backend con el game ya formateado
//       this.gamesService.getAllByUser();
//         return true; // Different number of messages
//     }else {
//       return false;
//     }
// }
    
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

  async playGame() {
    try {
      await this.toggleChatVisibility();
      //this.chat.messages = this.currentGame.conversation?.messages ?? [];
      // this.gamesService.joinRoom(this.currentGame.id ?? 1);
    } catch (e) {
      console.error("Error in playGame:", e);
    }
  }

  isComponentVisible: boolean = false;

  async toggleChatVisibility() {
    this.isComponentVisible = !this.isComponentVisible;
    return new Promise<void>(resolve => {
      setTimeout(resolve, 0);
    });
  }
}
