import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFrequentlyAskedQuestion } from '../frequently-asked-question.model';

@Component({
  selector: 'jhi-frequently-asked-question-detail',
  templateUrl: './frequently-asked-question-detail.component.html',
})
export class FrequentlyAskedQuestionDetailComponent implements OnInit {
  frequentlyAskedQuestion: IFrequentlyAskedQuestion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ frequentlyAskedQuestion }) => {
      this.frequentlyAskedQuestion = frequentlyAskedQuestion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
