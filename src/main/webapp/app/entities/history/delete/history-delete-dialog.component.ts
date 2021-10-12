import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHistory } from '../history.model';
import { HistoryService } from '../service/history.service';

@Component({
  templateUrl: './history-delete-dialog.component.html',
})
export class HistoryDeleteDialogComponent {
  history?: IHistory;

  constructor(protected historyService: HistoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.historyService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
