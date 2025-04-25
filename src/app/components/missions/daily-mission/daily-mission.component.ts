import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, FormGroup } from '@angular/forms';  // <-- Add this import
import { IMessage, IMissionXUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-daily-mission',
  templateUrl: './daily-mission.component.html',
  styleUrls: ['./daily-mission.component.scss','../../../../assets/layout/_footer.scss'],
  standalone: true, 
  imports: [CommonModule, FormsModule, MatGridListModule], // <-- Add FormsModule here
  providers: []
})
export class DailyMissionComponent {
  public fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);

  @Input() missionXUsers: IMissionXUser[] = [];


  constructor(){}

}


