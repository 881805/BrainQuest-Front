import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ModalComponent } from "../../components/modal/modal.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { AchievementFormComponent } from "../../components/achivements/achivements-form/achievement-form.component";
import { AchievementListComponent } from "../../components/achivements/achivements-list/achivements-list.component";
import { AchievementService } from "../../services/achievement.service";
import { inject, ViewChild } from "@angular/core";
import { ModalService } from "../../services/modal.service";
import { Form, FormBuilder, Validators } from "@angular/forms";
import { IAchievement, IAchievementPayload } from "../../interfaces";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { TopbarComponent } from "../../components/app-layout/elements/topbar/topbar.component";

@Component({
    selector: 'app-achievement',
    standalone: true,
    imports: [CommonModule,
        PaginationComponent,
        ModalComponent,
        LoaderComponent,
        AchievementFormComponent,
        AchievementListComponent,
        TopbarComponent
    ],
    templateUrl: './achievement.component.html',
    styleUrls: ['./achievement.component.scss'],
})
export class AchievementComponent {
    public achievementService: AchievementService = inject(AchievementService);
    public modalService: ModalService = inject(ModalService);
    @ViewChild('addAchievementModal') public addAchievementModal: any;
    public fb: FormBuilder = inject(FormBuilder);

    achievementForm = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        description: ['', Validators.required],
        isActive: [false],
        experience: [0, Validators.required],
        gameType: ['TRIVIA', Validators.required], // Valor predeterminado
        aim: this.fb.group({
            id: [''],
            name: ['', Validators.required],
            description: ['', Validators.required],
            isActive: [false],
            value: [0, Validators.required]
        })
    });

    constructor() {
        this.achievementService.search.page = 1;
        this.achievementService.getAll();
    }

    saveAchievement(achievement: IAchievement) {
        const transformedAchievement: IAchievementPayload = {
            ...achievement,
            gameType: { id: achievement.gameType?.id ?? 0 }
        };
    
        this.achievementService.save(transformedAchievement);
        this.modalService.closeAll();
    }

    callEdition(achievement: IAchievement) {
        this.achievementForm.controls['id'].setValue(achievement.id ? JSON.stringify(achievement.id) : null);
        this.achievementForm.controls['name'].setValue(achievement.name ? JSON.stringify(achievement.name) : null);
        this.achievementForm.controls['description'].setValue(achievement.description ? JSON.stringify(achievement.description) : null);
        this.achievementForm.controls['isActive'].setValue(achievement.active !== undefined ? achievement.active : null);
        this.achievementForm.controls['experience'].setValue(achievement.experience !== undefined ? achievement.experience : null);
        this.achievementForm.controls['gameType'].setValue(achievement.gameType?.id !== undefined ? String(achievement.gameType.id) : null);

        this.achievementForm.get(['aim', 'id'])?.setValue(achievement.aim?.id || null);
        this.achievementForm.get(['aim', 'name'])?.setValue(achievement.aim?.name || '');
        this.achievementForm.get(['aim', 'description'])?.setValue(achievement.aim?.description || '');
        this.achievementForm.get(['aim', 'isActive'])?.setValue(achievement.aim?.isActive || false);
        this.achievementForm.get(['aim', 'value'])?.setValue(achievement.aim?.value !== undefined ? String(achievement.aim?.value) : '');

        console.log('achievementsForm.value after setValue:');
        this.modalService.displayModal('md', this.addAchievementModal);
    }

    updateAchievement(achievement: IAchievement) {
        this.achievementService.update(achievement);
        this.modalService.closeAll();
    }
}