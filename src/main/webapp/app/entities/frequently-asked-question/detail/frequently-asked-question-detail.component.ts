import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFrequentlyAskedQuestion } from '../frequently-asked-question.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-frequently-asked-question-detail',
  templateUrl: './frequently-asked-question-detail.component.html',
})
export class FrequentlyAskedQuestionDetailComponent implements OnInit {
  frequentlyAskedQuestion: IFrequentlyAskedQuestion | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ frequentlyAskedQuestion }) => {
      this.frequentlyAskedQuestion = frequentlyAskedQuestion;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
