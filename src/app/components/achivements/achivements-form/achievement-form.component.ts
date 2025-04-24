import { CommonModule, DatePipe } from "@angular/common";
import { Component, EventEmitter, inject, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { GameTypeEnum } from "../../../interfaces";

@Component({
    selector: "app-achievement-form",
    templateUrl: "./achievement-form.component.html",
    styleUrls: ["./achievement-form.component.scss"],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DatePipe],
})
export class AchievementFormComponent 
{
    public fb: FormBuilder = inject(FormBuilder);
    @Input() achievementForm!: FormGroup;
    @Output() callSaveMethod: EventEmitter<any> = new EventEmitter<any>();
    @Output() callUpdateMethod: EventEmitter<any> = new EventEmitter<any>();

    gameTypeOptions = Object.values(GameTypeEnum);

    gameTypeData = [
      { id: 1, game_type: "TRIVIA" },
      { id: 2, game_type: "DEBATE" },
      { id: 3, game_type: "MULTIPLAYER_DEBATE" },
      { id: 4, game_type: "INTERVIEW" },
      { id: 5, game_type: "STORYBUILDER" }
  ];
      formSubmitted = false; 

      transformGameTypeToId(gameType: GameTypeEnum, gameTypeData: any[]): { id: number } | undefined {
        if (!gameType) {
            console.error('GameType is undefined or empty.');
            return undefined;
        }
    
        const foundGameType = gameTypeData.find(item => item.game_type === gameType);
        if (!foundGameType) {
            console.error('GameType not found in gameTypeData:', gameType);
            return undefined;
        }
    
        return { id: foundGameType.id };
    }

      callSave() {
        this.formSubmitted = true;
        if (this.achievementForm.invalid) {
            console.log('Form is invalid. Please correct the errors.');
            return;
        }
    
        const formValue = this.achievementForm.value;
        const gameTypeObject = formValue.gameType;

        const transformedGameType = this.transformGameTypeToId(gameTypeObject, this.gameTypeData);
        if (!transformedGameType) {
            console.error('Invalid gameType selected. Please select a valid game type.');
            return;
        }
    
        const achievementObject = {
            id: formValue.id || undefined,
            name: formValue.name,
            description: formValue.description,
            isActive: formValue.isActive,
            experience: formValue.experience,
            createdBy: { id: 1 },
            gameType: transformedGameType,
            aim: {
                id: formValue.aim.id || undefined,
                name: formValue.aim.name,
                description: formValue.aim.description,
                isActive: formValue.aim.isActive,
                value: formValue.aim.value
            }
        };
    
        if (achievementObject.id) {
            this.callUpdateMethod.emit(achievementObject);
            this.formSubmitted = false;
        } else {
            this.callSaveMethod.emit(achievementObject);
            this.formSubmitted = false;
        }
    }
}   

