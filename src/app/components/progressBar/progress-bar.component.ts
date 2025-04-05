import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  @Input() progress: number = 0;
  @Input() color: string = '#94F2F2';
  @Input() height: string = '8px';
  @Input() showPercentage: boolean = true;
}