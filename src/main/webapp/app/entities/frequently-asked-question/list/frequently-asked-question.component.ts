import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFrequentlyAskedQuestion } from '../frequently-asked-question.model';
import { FrequentlyAskedQuestionService } from '../service/frequently-asked-question.service';
import { FrequentlyAskedQuestionDeleteDialogComponent } from '../delete/frequently-asked-question-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-frequently-asked-question',
  templateUrl: './frequently-asked-question.component.html',
})
export class FrequentlyAskedQuestionComponent implements OnInit {
  frequentlyAskedQuestions?: IFrequentlyAskedQuestion[];
  isLoading = false;

  constructor(
    protected frequentlyAskedQuestionService: FrequentlyAskedQuestionService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.frequentlyAskedQuestionService.query().subscribe({
      next: (res: HttpResponse<IFrequentlyAskedQuestion[]>) => {
        this.isLoading = false;
        this.frequentlyAskedQuestions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFrequentlyAskedQuestion): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(frequentlyAskedQuestion: IFrequentlyAskedQuestion): void {
    const modalRef = this.modalService.open(FrequentlyAskedQuestionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.frequentlyAskedQuestion = frequentlyAskedQuestion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
