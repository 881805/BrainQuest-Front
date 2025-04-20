import { Component, inject, Input, OnDestroy, signal, ViewChild, WritableSignal } from '@angular/core';
import { GamesService } from '../../services/game.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalService } from '../../services/modal.service';
import { IConversation, IGame, IMessage, IUser } from '../../interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { effect } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { AlertService } from '../../services/alert.service';
import { firstValueFrom } from 'rxjs';
import { DailyMissionService } from '../../services/daily-missions.service';
import { InterviewChatComponent } from '../../components/interview/chat-interview';
import { AuthService } from '../../services/auth.service';
import { InterviewService } from '../../services/interview.Service';

@Component({
  selector: 'interview',
  standalone: true, 
  imports: [
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    InterviewChatComponent,
    CommonModule,
    Entrevista
  ],
  templateUrl: './interview.component.html', 
  styleUrls: ['./interview.component.scss'], 
})
export class Entrevista implements OnDestroy { 

  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  public messageService: MessageService = inject(MessageService);
  public interviewService: InterviewService = inject(InterviewService);
  public alertService: AlertService = inject(AlertService);

  public missionsXUsersService: DailyMissionService = inject(DailyMissionService);

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private initialReconnectDelay = 1000;
  private maxReconnectDelay = 30000;

  @ViewChild(InterviewChatComponent) chat!: InterviewChatComponent;

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

    effect(() => {
      const currentGames = this.games();
      this.currentGame = currentGames[0];
      this.messages.set(this.currentGame.conversation?.messages ?? []);
      if (this.games.length === 0) {
        console.log('Games updated:', currentGames);
      } else {
        console.log('Games updated:', this.games);
      }
    }, { allowSignalWrites: true });
  }

  ngOnDestroy(): void {}

  private async saveNewInterview() { 
    let interviewToSave: IGame = { 
      winner: { id: this.authService.getUser()?.id },
      gameType: { id: 1 }, 
      isOngoing: true,
      pointsEarnedPlayer1: 0,
      pointsEarnedPlayer2: 0,
      elapsedTurns: 0,
      maxTurns: 2,
      expirationTime: null
    };

    const response = await firstValueFrom(this.gamesService.add(interviewToSave)); 
    if (response?.data) {
      this.gamesService.game$.set([
        ...this.gamesService.game$(), 
        response.data 
      ]);
    }
  }

  async endInterview(interview: IGame) { 
    const response = await firstValueFrom(this.interviewService.save(this.currentGame));
    if (response) {
      this.currentGame = response as unknown as IGame;
      this.messages.set(this.currentGame.conversation!.messages!);

      let missions = this.missions();
      for (let mission of missions) {
        if (
          mission.mission?.objective?.scoreCondition !== undefined &&
          this.currentGame.pointsEarnedPlayer1 !== undefined &&
          mission.mission.objective.scoreCondition <= this.currentGame.pointsEarnedPlayer1 &&
          mission.isCompleted == false 
          && mission.mission.gameType?.gameType === 'INTERVIEW' 
        ) {
          mission.user = {id: mission.user?.id};
          mission.mission.createdBy = {id: mission.mission.createdBy?.id};
          mission.progress = (mission.progress ?? 0) + 1;
          console.log(mission);
          this.missionsXUsersService.update(mission);
        }
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
      this.currentGame = this.createInterviewRequest(this.currentGame); 
      if ((this.currentGame?.elapsedTurns ?? 0) >= (this.currentGame?.maxTurns ?? 0)) {
        const resp = await this.endInterview(this.currentGame); 
        return;
      }
      const response = await firstValueFrom(this.interviewService.save(this.currentGame)); 
      if (response) {
        console.log('Message from server:', response);
      }
      this.gamesService.getAllByUser();
    } catch (err) {
      console.error('Error saving message:', err);
      this.alertService.displayAlert('error', 'An error occurred while sending the message', 'center', 'top', ['error-snackbar']);
    }
  }

  createInterviewRequest(interview: IGame): IGame { 
    const interviewRequest: IGame = {
      id: interview.id,
      conversation: interview.conversation ? {
        id: interview.conversation.id,
        messages: this.makeMessagesWithoutUser(interview.conversation)
      } : null,
      winner: interview.winner ? { id: interview.winner.id } : undefined,
      question: interview.question ? { id: interview.question.id } : null,
      gameType: interview.gameType ? { id: interview.gameType.id } : undefined,
      isOngoing: interview.isOngoing,
      pointsEarnedPlayer1: interview.pointsEarnedPlayer1,
      pointsEarnedPlayer2: interview.pointsEarnedPlayer2,
      expirationTime: interview.expirationTime,
      timeLeft: interview.timeLeft,
      maxTurns: interview.maxTurns,
      elapsedTurns: interview.elapsedTurns,
    };
    return interviewRequest;
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

  async getReplyAI(interview: IGame) { 
    try {
      const response = await this.interviewService.save(interview).toPromise();
      console.log('Reply gotten successfully:', response);
      this.gamesService.getAllByUser();
    } catch (err) {
      console.error('Error getting reply:', err);
      this.alertService.displayAlert('error', 'An error occurred while getting the AI Reply', 'center', 'top', ['error-snackbar']);
      this.gamesService.getAllByUser();
    }
  }

  async startInterview() { 
    try {
      if (this.gamesService.game$().length < 1) {
        await this.saveNewInterview(); 
        window.location.reload();
      } else {
        this.isComponentVisible = true;
      }
    } catch (e) {
      console.error("Error in startInterview:", e);
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