import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFrequentlyAskedQuestion } from '../frequently-asked-question.model';
import { FrequentlyAskedQuestionService } from '../service/frequently-asked-question.service';

@Component({
  templateUrl: './frequently-asked-question-delete-dialog.component.html',
})
export class FrequentlyAskedQuestionDeleteDialogComponent {
  frequentlyAskedQuestion?: IFrequentlyAskedQuestion;

  constructor(protected frequentlyAskedQuestionService: FrequentlyAskedQuestionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.frequentlyAskedQuestionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
