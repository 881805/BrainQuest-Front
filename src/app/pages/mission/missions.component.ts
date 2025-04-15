import { Component, inject, ViewChild } from '@angular/core';
import { MissionFormComponent } from "../../components/missions/mission-form/mission-form.component";
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalService } from '../../services/modal.service';
import { MissionService } from '../../services/mission.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMission } from '../../interfaces';
import { MissionListComponent } from '../../components/missions/mission-list/mission-list.component';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    MissionFormComponent,
    MissionListComponent
  ],
  templateUrl: './missions.component.html',
  styleUrl: './missions.component.scss'
})
export class MissionsComponent {
  public missionService: MissionService = inject(MissionService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addMissionModal') public addMissionModal: any;
  public fb: FormBuilder = inject(FormBuilder);


missionForm = this.fb.group({
    id: [''],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    isDaily: [false],
    isActive: [false],
    objective: this.fb.group({ 
      id: [''],
      objectiveText: ['', Validators.required],
      scoreCondition: [0, Validators.required],
      ammountSuccesses: [0, Validators.required]
    }),
    experience: [0, Validators.required],
    gameType: [0, Validators.required]
  });


  constructor() {
    this.missionService.search.page = 1;
    this.missionService.getAll();
  }

  saveMission(mission: IMission) {
    this.missionService.save(mission);
    console.log(mission);
    this.modalService.closeAll();
  }

  formatDate(date: string | Date | null): string | null {
    if (!date) {
      return null;
    }
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObj.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  callEdition(mission: IMission) {
    this.missionForm.controls['id'].setValue(mission.id ? JSON.stringify(mission.id) : null);
    this.missionForm.controls['startDate'].setValue(mission.startDate ? new Date(mission.startDate) : null);
    this.missionForm.controls['endDate'].setValue(mission.endDate ? new Date(mission.endDate) : null);
    this.missionForm.controls['isDaily'].setValue(mission.isDaily !== undefined ? mission.isDaily : null);
    this.missionForm.controls['isActive'].setValue(mission.isActive !== undefined ? mission.isActive : null);
    this.missionForm.controls['experience'].setValue(mission.experience !== undefined ? mission.experience : null);
    this.missionForm.controls['gameType'].setValue(mission.gameType?.id ?? null);

    this.missionForm.get(['objective', 'id'])?.setValue(mission.objective?.id || null);
    this.missionForm.get(['objective', 'objectiveText'])?.setValue(mission.objective?.objectiveText || '');
    this.missionForm.get(['objective', 'scoreCondition'])?.setValue(mission.objective?.scoreCondition !== undefined ? String(mission.objective?.scoreCondition) : '');
    this.missionForm.get(['objective', 'ammountSuccesses'])?.setValue(mission.objective?.ammountSuccesses !== undefined ? String(mission.objective?.ammountSuccesses) : '');

    console.log('missionForm.value after setValue:', this.missionForm.value);
    this.modalService.displayModal('md', this.addMissionModal);
  }

  updateMission(mission: IMission) {
    this.missionService.update(mission);
    this.modalService.closeAll();
  }
}
