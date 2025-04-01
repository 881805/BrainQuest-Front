import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ITriviaQuestion } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-trivia',
   standalone: true,
    imports: [
    CommonModule,
    PaginationComponent,
    ModalComponent,
    LoaderComponent
    ],
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.scss'],
  
})
export class LogrosComponent  {
}