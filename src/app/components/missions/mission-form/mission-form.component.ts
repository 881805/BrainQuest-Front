import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GameTypeEnum } from '../../../interfaces';

@Component({
  selector: 'app-mission-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DatePipe
  ],
  templateUrl: './mission-form.component.html',
  styleUrl: './mission-form.component.scss'
})
export class MissionFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() missionForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<any> = new EventEmitter<any>();
  @Output() callUpdateMethod: EventEmitter<any> = new EventEmitter<any>();

  gameTypeOptions = Object.values(GameTypeEnum);

  gameTypeData = [
    { "id": 1, "created_at": "2025-04-03 18:40:19.107000", "description": "Modo de juego de trivia", "game_type": "TRIVIA" },
    { "id": 2, "created_at": "2025-04-03 18:40:19.122000", "description": "Modo de juego de debate", "game_type": "DEBATE" },
    { "id": 4, "created_at": "2025-04-03 18:40:19.133000", "description": "Modo de juego de entrevista", "game_type": "INTERVIEW" },
    { "id": 6, "created_at": "2025-04-03 18:40:19.138000", "description": "Modo de juego de mecanografía", "game_type": "TYPING" }
  ];
  
  formSubmitted = false; // Flag to track form submission

  transformGameTypeToId(gameType: GameTypeEnum, gameTypeData: any[]): { id: number } | undefined {
    const foundGameType = gameTypeData.find(item => item.game_type === gameType);
    if (foundGameType) {
      return { id: foundGameType.id };
    }
    return undefined;
  }

  callSave() {

    this.formSubmitted = true;
    if (this.missionForm.invalid) {
      console.log('Form is invalid. Please correct the errors.');
      return;
    }

    const formValue = this.missionForm.value;
    const gameTypeObject = formValue.gameType;

    const missionObject = {
      id: formValue.id || undefined,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      isDaily: formValue.isDaily,
      isActive: formValue.isActive,
      experience: formValue.experience,
      createdBy: { id: 1 },
      gameType: {id: gameTypeObject},
      objective: {
        id: formValue.objective?.id || undefined,
        objectiveText: formValue.objective?.objectiveText || undefined,
        scoreCondition: formValue.objective?.scoreCondition || undefined,
        ammountSuccesses: formValue.objective?.ammountSuccesses || undefined
      }
    };

    if (missionObject.id) {
      this.callUpdateMethod.emit(missionObject);
      this.formSubmitted = false; // Reset the flag after successful update emission
    } else {
      this.callSaveMethod.emit(missionObject);
      this.formSubmitted = false; // Reset the flag after successful save emission
    }
  }
}