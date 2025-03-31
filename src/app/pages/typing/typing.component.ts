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
import { interval } from 'rxjs';

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

  public loading: boolean = false;
  public gameStarted: boolean = false;
  public gameOver: boolean = false;
  public category: string = 'general';
  public difficulty: string = 'baja';
  public exercises: ITypingExercise[] = [];
  public currentExerciseIndex: number = 0;
  public timer: number = 60;
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
      
      this.generateNewExercise();
      this.startTimer();
    }
  }

  generateNewExercise(): void {
    this.loading = true;
    this.typingService.generateTypingExercise(this.category, this.difficulty).subscribe({
      next: (exercise) => {
        this.exercises.push(exercise);
        this.loading = false;
        this.generateText(exercise.text); // Asegura que se actualiza el texto correctamente
      },
      error: (error) => {
        console.error('Error al generar el ejercicio', error);
        this.loading = false;
      }
    });
  }

  startTimer(): void {
    this.timer = 60;
    this.intervalTimer = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.gameOver = true;
        clearInterval(this.intervalTimer);
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
  }

  finishExercise(): void {
    this.currentExerciseIndex++;

    if (this.currentExerciseIndex < 15) {
      this.stopTimer();
      this.generateNewExercise();
      this.startTimer();
    } else {
      this.stopTimer();
      this.gameOver = true;
    }
  }

  restartTyping(): void {
    this.gameStarted = false;
    this.gameOver = false;
    this.exercises = [];
    this.currentExerciseIndex = 0;
    this.typingForm.reset();
    this.score = 0;
    this.timer = 60;
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
      this.score += 10;
      (event.target as HTMLInputElement).value = "";
      this.hasError = false;
    } else {
      this.hasError = true;
    }
  }
}
