import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IHistory } from '../../../interfaces';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-list.component.html',
  styleUrl: './history-list.component.scss'
})
export class HistoryListComponent {
  @Input() title: string = '';
  @Input() historyList: IHistory[] = [];

  @Output() callDetails: EventEmitter<IHistory> = new EventEmitter<IHistory>();
  @Output() callDelete: EventEmitter<IHistory> = new EventEmitter<IHistory>();

  get reversedHistoryList(): IHistory[] {
    return [...this.historyList].reverse(); 
  }
  
}
