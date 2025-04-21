import { Component, inject, ViewChild } from '@angular/core';
import { TypingService } from '../../services/typing.service';
import { ITypingExercise } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DailyMissionService } from '../../services/daily-missions.service';

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
    ReactiveFormsModule
  ]
})
export class TypingComponent {
  public typingService: TypingService = inject(TypingService);
  public modalService: ModalService = inject(ModalService);
  public fb: FormBuilder = inject(FormBuilder);
  @ViewChild('addTypingModal') public addTypingModal: any;


  public missionsXUsersService : DailyMissionService= inject(DailyMissionService);
  public missions = this.missionsXUsersService.dailyMissions$;

  public loading: boolean = false;
  public gameStarted: boolean = false;
  public gameOver: boolean = false;
  public category: string = '';
  public difficulty: string = '';
  public exercises: ITypingExercise[] = [];
  public currentExerciseIndex: number = 0;
  public timer: number = 160; // Este valor será ajustado dinámicamente
  public intervalTimer: any;

  public textArray: string[] = [];
  public currentWordIndex: number = 0;
  public hasError: boolean = false;
  public score: number = 0;

  public typingForm = this.fb.group({
    category: [this.category, Validators.required],
    difficulty: [this.difficulty, Validators.required]
  });

  constructor() {
    this.loadTypingExercises();
    this.missionsXUsersService.getAllByUser();
  }

  ngOnInit(): void {}

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

      this.setTimerByDifficulty(); // Establecer el tiempo según la dificultad

      this.generateNewExercise();
      this.startTimer();
    }
  }

  setTimerByDifficulty(): void {
    switch (this.difficulty) {
      case 'media':
        this.timer = 120; // 2 minutos para dificultad media
        break;
      case 'alta':
        this.timer = 90; // 1.5 minutos para dificultad alta
        break;
      case 'baja':
      default:
        this.timer = 160; // 2.5 minutos para dificultad baja
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
    this.stopTimer(); // Detener cualquier temporizador anterior

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
}