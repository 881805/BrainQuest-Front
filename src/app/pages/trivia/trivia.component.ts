import { Component, inject, ViewChild } from '@angular/core';
import { TriviaService } from '../../services/trivia.service';
import { ITriviaQuestion } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { interval } from 'rxjs';

@Component({
  selector: 'app-trivia-page',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    PaginationComponent,
    ModalComponent,
    ReactiveFormsModule
  ]
})
export class TriviaComponent {
  public triviaService: TriviaService = inject(TriviaService);
  public modalService: ModalService = inject(ModalService);
  public fb: FormBuilder = inject(FormBuilder);
  @ViewChild('addTriviaModal') public addTriviaModal: any;

  public feedbackList: any[] = [];
  public userAnswers: { questionId: number, userAnswer: string }[] = [];

  public loading: boolean = false;
  public gameStarted: boolean = false;
  public gameOver: boolean = false;
  public category: string = '';
  public difficulty: string = '';
  public questions: ITriviaQuestion[] = [];
  public currentQuestionIndex: number = 0;
  public timer: number = 60; 
  public intervalTimer: any;

  public triviaForm = this.fb.group({
    category: [this.category, Validators.required],
    difficulty: [this.difficulty, Validators.required]
  });

  constructor() {
    this.loadTriviaQuestions();
  }

  ngOnInit(): void {}

  loadTriviaQuestions(): void {
    this.loading = true;
    this.triviaService.getTriviaQuestions(this.category, this.difficulty).subscribe({
      next: (data) => {
        this.questions = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar las preguntas de trivia', error);
        this.loading = false;
      }
    });
  }

  startTrivia(): void {
    if (this.triviaForm.valid) {
      this.gameStarted = true;
      this.gameOver = false;
      this.isComponentVisible = false; 

      this.category = this.triviaForm.controls['category'].value || '';
      this.difficulty = this.triviaForm.controls['difficulty'].value || '';
      this.generateNewQuestion();
      this.startTimer();
    }
  }

  generateNewQuestion(): void {
    if (this.currentQuestionIndex < 15) {
      this.loading = true;
      this.triviaService.generateTriviaQuestion(this.category, this.difficulty).subscribe({
        next: (question) => {
          this.questions.push(question);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al generar la pregunta', error);
          this.loading = false;
        }
      });
    } else {
      this.gameOver = true;
    }
  }

  startTimer(): void {
    this.timer = 60; 
    this.intervalTimer = interval(1000).subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.checkAnswer(''); 
      }
    });
  }

  stopTimer(): void {
    if (this.intervalTimer) {
      this.intervalTimer.unsubscribe();
    }
  }

  getCurrentQuestion(): ITriviaQuestion | null {
    return this.questions.length > 0 ? this.questions[this.currentQuestionIndex] : null;
  }

  checkAnswer(option: any): void {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return;

    const selectedOption = option.text || option; 
    
    if (selectedOption === currentQuestion.correctAnswer) {
      console.log('Respuesta correcta:', selectedOption);
    } else {
      console.log('Respuesta incorrecta:', selectedOption);
    }

    currentQuestion.userAnswer = selectedOption;

    this.userAnswers.push({
      questionId: currentQuestion.id ?? 0,
      userAnswer: selectedOption
    });

    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < 10) {
      this.stopTimer(); 
      this.generateNewQuestion(); 
      this.startTimer(); 
    } else {
      this.stopTimer();
      this.gameOver = true;
      this.enviarFeedback();
    }
  }

  enviarFeedback(): void {
    const payload = {
      answers: this.userAnswers
    };

    this.triviaService.getFeedback(payload).subscribe({
      next: (data: any) => {
        this.feedbackList = data;
      },
      error: (err) => {
        console.error('Error al obtener feedback', err);
      }
    });
  }

  calculateScore(): number {
    return this.questions.filter(q => q.userAnswer === q.correctAnswer).reduce((score, question) => {
      switch (question.difficulty) {
        case 'baja': return score + 1;
        case 'media': return score + 3;
        case 'alta': return score + 5;
        default: return score;
      }
    }, 0);
  }

  restartTrivia(): void {
    this.gameStarted = false;
    this.gameOver = false;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.feedbackList = [];
    this.triviaForm.reset();
    this.triviaForm.patchValue({ category: 'politica', difficulty: 'baja' }); 
    this.isComponentVisible = true; 
  }

  isComponentVisible: boolean = true;
}
