import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProgressBarComponent } from '../progressBar/progress-bar.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-progress-card',
  standalone: true,
  imports: [
    CommonModule,
    ProgressBarComponent,
    LucideAngularModule
  ],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressCardComponent {
  @Input() title: string = '';
  @Input() progress: number = 0;
  @Input() icon: string = '';
  @Input() color: string = '#94F2F2';
}