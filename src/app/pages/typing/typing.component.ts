import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { TypingService } from '../../services/typing.service';
import { IGame, IHistory, ITypingExercise } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DailyMissionService } from '../../services/daily-missions.service';
import { GamesService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { HistoryService } from '../../services/history.service';
import { firstValueFrom } from 'rxjs';
import { ConfettiService } from '../../services/confetti.service';

@Component({
  selector: 'app-typing-page',
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    PaginationComponent,
    ModalComponent,
    ReactiveFormsModule, 
    FormsModule
  ]
})
export class TypingComponent implements OnDestroy{
  public typingService: TypingService = inject(TypingService);
  public modalService: ModalService = inject(ModalService);
  public fb: FormBuilder = inject(FormBuilder);
  public currentText: string = '';
  @ViewChild('addTypingModal') public addTypingModal: any;
  public exerciseStarted: boolean = false;
  public gamesService: GamesService = inject(GamesService);
  public authService: AuthService = inject(AuthService);
  public historyService: HistoryService = inject(HistoryService);
  private confetti = inject(ConfettiService);

  public missionsXUsersService : DailyMissionService= inject(DailyMissionService);
  public missions = this.missionsXUsersService.dailyMissions$;

  public loading: boolean = false;
  public gameStarted: boolean = false;
  public gameOver: boolean = false;
  public category: string = '';
  public difficulty: string = '';
  public exercises: ITypingExercise[] = [];
  public currentExerciseIndex: number = 0;
  public timer: number = 160; 
  public intervalTimer: any;

  public textArray: string[] = [];
  public currentWordIndex: number = 0;
  public hasError: boolean = false;
  public score: number = 0;

  public userInput: string = '';

  public typingForm = this.fb.group({
    category: [this.category, Validators.required],
    difficulty: [this.difficulty, Validators.required]
  });

  constructor() {
    this.loadTypingExercises();
    this.missionsXUsersService.getAllByUser();

  }
  ngOnDestroy(): void {
    this.stopTimer();
  }

  ngOnInit(): void { }

  loadTypingExercises(): void {
    this.loading = true;
    this.typingService.getTypingExercises(this.category, this.difficulty).subscribe({
      next: (data) => {
        this.exercises = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar los ejercicios de mecanografía', error);
        this.loading = false;
      }
    });
  }

  startTyping(): void {
    if (this.typingForm.valid) {
      this.gameStarted = true;
      this.gameOver = false;
      this.category = this.typingForm.controls['category'].value || '';
      this.difficulty = this.typingForm.controls['difficulty'].value || '';

      this.setTimerByDifficulty(); 

      this.generateNewExercise();
      this.startTimer();
    }
  }


  
     private async saveNewGame() {
        let gameToSave: IGame = {
          winner: { id: this.authService.getUser()?.id },
          gameType: { id: 1 },
          isOngoing: false,
          pointsEarnedPlayer1: this.score,
          pointsEarnedPlayer2: 0,
          elapsedTurns: 0,
          maxTurns: 0,
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
          this.authService.getUserFromServer();
    
        }
      }

  setTimerByDifficulty(): void {
    switch (this.difficulty) {
      case 'media':
        this.timer = 120; 
        break;
      case 'alta':
        this.timer = 90; 
        break;
      case 'baja':
      default:
        this.timer = 160; 
        break;
    }
  }

  generateNewExercise(): void {
    this.loading = true;
    this.typingService.generateTypingExercise(this.category, this.difficulty).subscribe({
      next: (exercise) => {
        this.exercises.push(exercise);
        this.loading = false;
        this.generateText(exercise.text);
      },
      error: (error) => {
        console.error('Error al generar el ejercicio', error);
        this.loading = false;
      }
    });
  }

  startTimer(): void {
    this.stopTimer(); 

    this.intervalTimer = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.gameOver = true;
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  }

  finishExercise(): void {
    this.currentExerciseIndex++;

    if (this.currentExerciseIndex < 1) {
      this.stopTimer();
      this.generateNewExercise();
      this.startTimer();
    } else {
      this.stopTimer();
      this.gameOver = true;
      this.gameStarted = false;
      this.checkMissions();
      this.saveNewGame();
      this.confetti.celebrate();
    }
  }

  async checkMissions(){

    let pointsEarned  = this.score;
    let missions = this.missions();
       for (let mission of missions) {
      if (
        mission.mission?.objective?.scoreCondition !== undefined &&
        pointsEarned !== undefined &&
        mission.mission.objective.scoreCondition <= pointsEarned &&
        mission.isCompleted == false 
        && mission.mission.gameType?.gameType === 'TYPING'
      ) {
        mission.user = {id: mission.user?.id};
        mission.mission.createdBy = {id: mission.mission.createdBy?.id};
        mission.progress = (mission.progress ?? 0) + 1;
        console.log(mission);
        this.missionsXUsersService.update(mission);
      }
    }
  }


  restartTyping(): void {
    this.gameStarted = false;
    this.gameOver = false;
    this.exercises = [];
    this.currentExerciseIndex = 0;
    this.typingForm.reset();
    this.score = 0;
    this.timer = 160;
    this.stopTimer();
    this.generateNewExercise();
  }

  generateText(text: string): void {
    this.textArray = text.split(" ");
    this.currentWordIndex = 0;
    this.hasError = false;
  }

  onType(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim();

    if (this.textArray[this.currentWordIndex] === input) {
      this.currentWordIndex++;
      this.score += this.getPointsPerWord();
      (event.target as HTMLInputElement).value = "";
      this.hasError = false;

      if (this.currentWordIndex === this.textArray.length && !this.gameOver) {
        this.finishExercise();
      }
    } else {
      this.hasError = true;
    }
  }

  getPointsPerWord(): number {
    switch (this.difficulty.toLowerCase()) {
      case 'media':
        return 3;
      case 'alta':
        return 5;
      case 'baja':
      default:
        return 1;
    }
  }

  checkTyping (): void {

  }
}