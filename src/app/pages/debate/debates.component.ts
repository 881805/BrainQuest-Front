import { Component, inject, Input, OnDestroy, signal, ViewChild, WritableSignal } from '@angular/core';
import { GamesService } from '../../services/game.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalService } from '../../services/modal.service';
import { IConversation, IGame, IHistory, IMessage, IUser } from '../../interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DebateChatComponent } from '../../components/chat/chat.component';
import { CommonModule } from '@angular/common';
import { effect } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { DebatesService } from '../../services/debate.service';
import { AlertService } from '../../services/alert.service';
import { firstValueFrom } from 'rxjs';
import { DailyMissionService } from '../../services/daily-missions.service';
import { HistoryService } from '../../services/history.service';
import { ConfettiService } from '../../services/confetti.service';

@Component({
  selector: 'app-debates',           
  standalone: true,                  
  imports: [                         
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    DebateChatComponent,
    CommonModule
  ],
  templateUrl: './debates.component.html',  
  styleUrls: ['./debates.component.scss'], 
})

export class DebatesComponent implements OnDestroy {

  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  public messageService: MessageService = inject(MessageService);
  public debatesService: DebatesService = inject(DebatesService);
  public alertService: AlertService = inject(AlertService);
  public historyService: HistoryService = inject(HistoryService);

  public missionsXUsersService : DailyMissionService= inject(DailyMissionService);
  private confetti = inject(ConfettiService);
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private initialReconnectDelay = 1000;
  private maxReconnectDelay = 30000;

  @ViewChild(DebateChatComponent) chat!: DebateChatComponent;

  public fb: FormBuilder = inject(FormBuilder);
  orderForm = this.fb.group({
    id: [''],
    description: ['', Validators.required],
    total: ['', Validators.required],
  });

  public games = this.gamesService.game$;
  public missions = this.missionsXUsersService.dailyMissions$;
  public currentGame: IGame = {};
  public messages: WritableSignal<IMessage[]> = signal([]);

  constructor(private gamesService: GamesService) {

    this.gamesService.getAllByUser(); 
    this.missionsXUsersService.getAllByUser();
    const showComponent = localStorage.getItem('showComponent');
    if (showComponent === 'true') {
      this.isComponentVisible = true;
      localStorage.removeItem('showComponent'); 
    }
    effect(() => {
      const currentGames = this.games();
      this.currentGame= currentGames[0];
      this.messages.set(this.currentGame.conversation?.messages ?? []);
      if (this.games.length === 0) {
        console.log('Games updated:', currentGames);
      } else {
        console.log('Games updated:', this.games);
      }
    }, { allowSignalWrites: true });
  }

  ngOnDestroy(): void {}

  private async saveNewGame() {
    let gameToSave: IGame = {
      winner: { id: this.authService.getUser()?.id },
      gameType: { id: 2 },
      isOngoing: true,
      pointsEarnedPlayer1: 0,
      pointsEarnedPlayer2: 0,
      elapsedTurns: 0,
      maxTurns: 2,
      expirationTime: null
    };

    const response = await firstValueFrom(this.gamesService.add(gameToSave));
    if (response) {
      const history: IHistory = {
        lastPlayed: new Date(),
        user: { id: this.authService.getUser()?.id! },  
        game: { id: response.id }
      };
      
      await this.historyService.save(history);
    }
  }

  async endGame(game: IGame) {
    const response = await firstValueFrom(this.debatesService.save(this.currentGame));
    if (response) {
      this.currentGame = response as unknown as IGame;
      this.messages.set(this.currentGame.conversation!.messages!);
      await this.updateHistory();
      await this.checkMissions();
    }
    this.updateHistory();
    this.authService.getUserFromServer();
    this.confetti.celebrate();

  }

  async checkMissions(){
    let missions = this.missions();
       for (let mission of missions) {
      if (
        mission.mission?.objective?.scoreCondition !== undefined &&
        this.currentGame.pointsEarnedPlayer1 !== undefined &&
        mission.mission.objective.scoreCondition <= this.currentGame.pointsEarnedPlayer1 &&
        mission.isCompleted == false 
        && mission.mission.gameType?.gameType === 'DEBATE'
      ) {
        mission.user = {id: mission.user?.id};
        mission.mission.createdBy = {id: mission.mission.createdBy?.id};
        mission.progress = (mission.progress ?? 0) + 1;
        console.log(mission);
        this.missionsXUsersService.update(mission);
        this.authService.getUserFromServer();
      }
    }
  }

  async saveMessage(message: IMessage) {
    const user = this.authService.getUser() as IUser;
    const messageId = (this.currentGame?.conversation?.messages?.length ?? 0) + 1;
    const updatedMessage = {
      id: messageId,
      ...message,
      conversation: { id: this.currentGame.conversation?.id || 1 },
      user: { id: user.id }
    };

    try {
      this.currentGame.conversation?.messages?.push(updatedMessage);
      this.currentGame = this.createGameRequest(this.currentGame);
      if ((this.currentGame?.elapsedTurns ?? 0) >= (this.currentGame?.maxTurns ?? 0)) {
        const resp = await this.endGame(this.currentGame);
        return;
      }
      const response = await firstValueFrom(this.debatesService.save(this.currentGame));
      if (response) {
        console.log('Message from server:', response);
      }
      this.gamesService.getAllByUser();
      await this.updateHistory();
      
    } catch (err) {
      console.error('Error saving message:', err);
      this.alertService.displayAlert('error', 'Un error ocurrió al enviar el mensaje', 'center', 'top', ['error-snackbar']);
    }
  }

  async updateHistory(){
    try {
      const response = await firstValueFrom(
        this.historyService.getByGame('DEBATE', this.authService.getUser()?.id || 1)
      );
  
      if (response && Array.isArray(response.data) && response.data.length > 0) {
        response.data[0].lastPlayed = new Date();
        response.data[0].game = {id: response.data[0].game.id};
        response.data[0].user = {id: response.data[0].user.id};
        this.historyService.update(response.data[0]);
      }
    } catch (err) {
      this.alertService.displayAlert(
        'error',
        'Error cargando historial',
        'center',
        'top',
        ['error-snackbar']
      );
      console.error('Error getting history', err);
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

  async getReplyAI(game: IGame) {
    try {
      const response = await this.debatesService.save(game).toPromise();
      console.log('Reply gotten successfully:', response);
      this.gamesService.getAllByUser();
    } catch (err) {
      console.error('Error getting reply:', err);
      this.alertService.displayAlert('error', 'Un error ocurrió al obtener la respuesta del IA', 'center', 'top', ['error-snackbar']);
      this.gamesService.getAllByUser();
    }
  }
  async playGame() {
    try {
      if (this.gamesService.game$().length < 1) {
        await this.saveNewGame();
  
        localStorage.setItem('showComponent', 'true');

        window.location.reload();
      } else {
        this.isComponentVisible = true;
      }
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

  async onRestartDebate() {
    await this.saveNewGame(); 
    this.gamesService.getAllByUser(); 
  }
}