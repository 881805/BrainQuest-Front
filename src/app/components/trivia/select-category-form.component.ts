// src/app/components/select-category-form/select-category-form.component.ts

import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-category-form',
  templateUrl: './select-category-form.component.html',
  styleUrls: ['./select-category-form.component.scss'],
})
export class SelectCategoryFormComponent {

  @Output() select = new EventEmitter<{ category: string, difficulty: string }>();

  category: string = '';
  difficulty: string = '';

  onSubmit() {
    if (this.category && this.difficulty) {
      this.select.emit({ category: this.category, difficulty: this.difficulty });
    }
  }
}
