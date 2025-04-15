import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-trivia-feedback',
  templateUrl: './trivia-feedback.component.html',
  styleUrls: ['./trivia-feedback.component.scss']
})
export class TriviaFeedbackComponent implements OnInit {

  @Input() incorrectAnswers: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}