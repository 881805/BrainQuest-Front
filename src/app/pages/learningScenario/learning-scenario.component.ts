import { Component, inject, ViewChild } from '@angular/core';
import { ILearningScenario } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { interval } from 'rxjs';
import { LearningScenarioService } from '../../services/learning-Scenario.Service';
import { Zap } from 'lucide-angular';

@Component({
  selector: 'app-learning-scenario',
  templateUrl: './learning-scenario.component.html',
  styleUrls: ['./learning-scenario.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    PaginationComponent,
    ModalComponent,
    ReactiveFormsModule
  ]
})
export class LearningScenarioComponent {
  public learningScenarioService = inject(LearningScenarioService);
  public modalService = inject(ModalService);
  public fb = inject(FormBuilder);
  public feedbackList: any[] = [];
  public userAnswers: { scenarioId: number, selectedOption: string }[] = [];
  public loading = false;
  public gameStarted = false;
  public gameOver = false;
  public topic = '';
  public currentStep = 1;
  public totalSteps = 5;
  public scenarios: ILearningScenario[] = [];
  public currentScenarioIndex = 0;
  public timer = 60;
  public intervalTimer: any;
  public isComponentVisible = true;
  public learningForm = this.fb.group({
    topic: [this.topic, Validators.required]
  });

  constructor() {
    this.loadLearningScenarios();
  }


  loadLearningScenarios(): void {
    this.loading = true;
    this.learningScenarioService.getLearningScenarios(this.topic).subscribe({
      next: (data) => {
        this.scenarios = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar los escenarios de aprendizaje', error);
        this.loading = false;
      }
    });
  }


  startLearning(): void {
    if (this.learningForm.valid) {
      this.gameStarted = true;
      this.gameOver = false;
      this.isComponentVisible = false;
      this.topic = this.learningForm.controls['topic'].value || '';
      this.currentStep = 1;
      this.generateNewScenario();
      this.startTimer();
    }
  }


  generateNewScenario(): void {
    this.loading = true;
    this.learningScenarioService.generateLearningScenario(this.topic).subscribe({
       next: (scenario) => {
          this.scenarios.push(scenario);
          this.currentScenarioIndex = this.scenarios.length - 1;
          this.loading = false;
          this.startTimer(); 
       },
       error: (error) => {
          console.error('Error al generar el escenario', error);
          this.loading = false;
       }
    });
 }


  getCurrentScenario(): ILearningScenario | null {
    const scenario = this.scenarios[this.currentScenarioIndex];
    return scenario && scenario.question && scenario.options ? scenario : null;
  }


  submitAnswer(selectedOption: string): void {
    console.log(`Opción seleccionada: ${selectedOption}`);
    const scenario = this.getCurrentScenario();
    if (!scenario || !selectedOption) return;
    console.log(`Respuesta correcta: ${scenario.correctAnswer}`);
    if (!scenario.attemptedOptions) scenario.attemptedOptions = [];
    if (scenario.selectedOption === scenario.correctAnswer) return;
  
    scenario.selectedOption = selectedOption;
  
    if (selectedOption === scenario.correctAnswer) {
      scenario.completed = true;
      this.userAnswers.push({
        scenarioId: scenario.id ?? 0,
        selectedOption
      });
      this.stopTimer();
      console.log('¡Respuesta correcta!');
    } else {
      scenario.attempts = (scenario.attempts ?? 0) + 1;
      scenario.attemptedOptions.push(selectedOption);
      if (scenario.attempts >= 5) {
        scenario.blocked = true;
      }
      if (!scenario.incorrectFeedback) {
        scenario.incorrectFeedback = [];
      }
  
      const feedbackRequest = {
        topic: this.topic,
        question: scenario.question,
        selected: selectedOption,
        correctAnswer: scenario.correctAnswer
      };
      
      this.learningScenarioService.getAIFeedback(scenario.id ?? 0, selectedOption).subscribe({
        next: (data: any) => {
          console.log('Feedback recibido:', data);
          const feedbackText = typeof data === 'string' ? data : data.feedback || "No se pudo obtener un feedback válido.";
          if (!scenario.incorrectFeedback) {
            scenario.incorrectFeedback = [];
          }
          scenario.incorrectFeedback.push({
            option: selectedOption,
            feedback: feedbackText
          });
        },
        error: (err) => {
          console.error('Error de feedback inmediato', err);
          if (!scenario.incorrectFeedback) {
            scenario.incorrectFeedback = [];
          }
          scenario.incorrectFeedback.push({
            option: selectedOption,
            feedback: "Hubo un error al obtener el feedback."
          });
        }
      });
    }
  }
  

  isOptionDisabled(option: string): boolean {
    const scenario = this.getCurrentScenario();
    if (!scenario) return true;
    return (
      scenario.selectedOption === scenario.correctAnswer ||
      (scenario.attemptedOptions?.includes(option) ?? false)
    );
  }
  

  goToNextScenario(): void {
    if (this.currentStep >= this.totalSteps) {
      this.gameOver = true;
      this.sendFeedback(); 
      return;
    }
  
    this.currentStep++;
    this.currentScenarioIndex++;
    if (this.currentScenarioIndex >= this.scenarios.length) {
      this.generateNewScenario(); 
      return;
    }
  
    this.startTimer();
  
    const scenario = this.getCurrentScenario();
    if (scenario) {
      scenario.selectedOption = '';
      scenario.incorrectFeedback = [];
      scenario.attemptedOptions = [];
      scenario.completed = false;
      scenario.blocked = false;
    }
  }
  

  startTimer(): void {
    this.timer = 60;
    this.stopTimer();
    this.intervalTimer = interval(1000).subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.submitAnswer(''); 
      }
    });
  }


  stopTimer(): void {
    if (this.intervalTimer) {
      this.intervalTimer.unsubscribe();
    }
  }


  sendFeedback(): void {
    const payload = { answers: this.userAnswers };
  
    this.learningScenarioService.getAIFeedback(0, JSON.stringify(payload)).subscribe({
      next: (data: any) => {
        this.feedbackList = data;
      },
      error: (err) => {
        console.error('Error al obtener feedback', err);
      }
    });
  }
  

  restartLearning(): void {
    this.gameStarted = false;
    this.gameOver = false;
    this.scenarios = [];
    this.currentScenarioIndex = 0;
    this.userAnswers = [];
    this.feedbackList = [];
    this.learningForm.reset();
    this.isComponentVisible = true;
  }
}
