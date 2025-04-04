import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IGame } from '../../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './games-list.component.html'
})
export class GamesListComponent {
  @Input() title: string  = '';
  @Input() game: IGame[] = [];
  @Output() callModalAction: EventEmitter<IGame> = new EventEmitter<IGame>();
  @Output() callDeleteAction: EventEmitter<IGame> = new EventEmitter<IGame>();
}
