import { Component, inject } from '@angular/core';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { HistoryListComponent } from '../../components/history/history-list/history-list.component';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    LoaderComponent,
    PaginationComponent,
    HistoryListComponent,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  public historyService = inject(HistoryService);

  constructor() {
    this.historyService.search.page = 1;
    this.historyService.getAll();
  }
}
