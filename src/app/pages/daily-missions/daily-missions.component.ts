import { Component, inject, Input, OnDestroy, signal, ViewChild, WritableSignal } from '@angular/core';
import { GamesService } from '../../services/game.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalService } from '../../services/modal.service';
import { IGame, IMessage, IUser } from '../../interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DebateChatComponent } from '../../components/chat/chat.component';
import { CommonModule } from '@angular/common';

import { MessageService } from '../../services/message.service';
import { AlertService } from '../../services/alert.service';
import { DailyMissionComponent } from '../../components/missions/daily-mission/daily-mission.component';
import { DailyMissionService } from '../../services/daily-missions.service';


@Component({
  selector: 'app-daily-missions',          
  standalone: true,                 
  imports: [                         
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    CommonModule,
    DailyMissionComponent
  ],
  templateUrl: './daily-missions.component.html',  
  styleUrls: ['./daily-missions.component.scss'],  
})
export class DailyMissionsComponent implements OnDestroy {

  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  public dailyMissionService: DailyMissionService = inject(DailyMissionService);
  public alertService: AlertService = inject(AlertService);

  constructor(private dailyMissionsSevice: DailyMissionService) {

    this.dailyMissionsSevice.getAllByUser(); 
  }

  ngOnDestroy(): void {

  }

  
}
