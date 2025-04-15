import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMission } from '../../../interfaces';

@Component({
  selector: 'app-mission-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mission-list.component.html',
  styleUrl: './mission-list.component.scss'
})
export class MissionListComponent {
  @Input() title: string = '';
  @Input() missions: IMission[] = [];

  @Output() callModalAction: EventEmitter<IMission> = new EventEmitter<IMission>();
  @Output() callDeleteAction: EventEmitter<IMission> = new EventEmitter<IMission>();
}
