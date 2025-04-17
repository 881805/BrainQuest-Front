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
import { InterviewService } from '../../services/Interview.Service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-interview', // Cambié el selector a 'app-interviews'
  standalone: true, 
  imports: [
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    InterviewChatComponent,
    CommonModule
  ],
  templateUrl: './interview.component.html',  // Cambié el nombre del archivo HTML
  styleUrls: ['./interview.component.scss'], 
})
export class InterviewsComponent implements OnDestroy { // Cambié el nombre de la clase

  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  public messageService: MessageService = inject(MessageService);
  public interviewService: InterviewService = inject(InterviewService); // Adaptado a InterviewService
  public alertService: AlertService = inject(AlertService);

  public missionsXUsersService: DailyMissionService = inject(DailyMissionService);

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private initialReconnectDelay = 1000;
  private maxReconnectDelay = 30000;

  @ViewChild(InterviewChatComponent) chat!: InterviewChatComponent; // Adaptado a InterviewChatComponent

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

  private async saveNewInterview() { // Cambié el nombre a saveNewInterview
    let interviewToSave: IGame = { // Cambio de 'game' a 'interview' para reflejar el contexto
      winner: { id: this.authService.getUser()?.id },
      gameType: { id: 1 }, // Cambié el tipo de juego a 'INTERVIEW'
      isOngoing: true,
      pointsEarnedPlayer1: 0,
      pointsEarnedPlayer2: 0,
      elapsedTurns: 0,
      maxTurns: 2,
      expirationTime: null
    };

    const response = await firstValueFrom(this.gamesService.add(interviewToSave)); // Llamada a API de 'interview'
    if (response?.data) {
      this.gamesService.game$.set([
        ...this.gamesService.game$(), 
        response.data 
      ]);
    }
  }

  async endInterview(interview: IGame) { // Cambié 'endGame' a 'endInterview'
    const response = await firstValueFrom(this.interviewService.save(this.currentGame)); // Llamada al servicio de entrevistas
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
          && mission.mission.gameType?.gameType === 'INTERVIEW' // Adaptado para entrevistas
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
      this.currentGame = this.createInterviewRequest(this.currentGame); // Adapté a la entrevista
      if ((this.currentGame?.elapsedTurns ?? 0) >= (this.currentGame?.maxTurns ?? 0)) {
        const resp = await this.endInterview(this.currentGame); // Llamada al método de finalizar entrevista
        return;
      }
      const response = await firstValueFrom(this.interviewService.save(this.currentGame)); // Llamada al servicio de entrevistas
      if (response) {
        console.log('Message from server:', response);
      }
      this.gamesService.getAllByUser();
    } catch (err) {
      console.error('Error saving message:', err);
      this.alertService.displayAlert('error', 'An error occurred while sending the message', 'center', 'top', ['error-snackbar']);
    }
  }

  createInterviewRequest(interview: IGame): IGame { // Adaptado a 'interview'
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

  async getReplyAI(interview: IGame) { // Adaptado a 'interview'
    try {
      const response = await this.interviewService.save(interview).toPromise(); // Llamada al servicio de entrevistas
      console.log('Reply gotten successfully:', response);
      this.gamesService.getAllByUser();
    } catch (err) {
      console.error('Error getting reply:', err);
      this.alertService.displayAlert('error', 'An error occurred while getting the AI Reply', 'center', 'top', ['error-snackbar']);
      this.gamesService.getAllByUser();
    }
  }

  async startInterview() { // Adapté el método de inicio de juego a "startInterview"
    try {
      if (this.gamesService.game$().length < 1) {
        await this.saveNewInterview(); // Llamada al método para crear nueva entrevista
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
