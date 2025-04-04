import { Component, Input } from '@angular/core';
import { Challenge } from '../../interfaces';


@Component({
  selector: 'app-challenge',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.scss']
})
export class ChallengeCardComponent {
  @Input() challenge!: Challenge;
  @Input() showButton: boolean = true;
}