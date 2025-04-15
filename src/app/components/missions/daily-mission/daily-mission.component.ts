import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbChatModule, NbCardModule, NbStatusService } from '@nebular/theme';
import { FormBuilder, FormsModule, FormGroup } from '@angular/forms';  // <-- Add this import
import { IMessage, IMissionXUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-daily-mission',
  templateUrl: './daily-mission.component.html',
  styleUrls: ['./daily-mission.component.scss'],
  standalone: true, 
  imports: [NbChatModule, NbCardModule, CommonModule, FormsModule, MatGridListModule], // <-- Add FormsModule here
  providers: [NbStatusService]
})
export class DailyMissionComponent {
  public fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);

  @Input() missionXUsers: IMissionXUser[] = [];


  constructor(){}

}


