import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITender } from '../tender.model';
import { TenderService } from '../service/tender.service';

@Component({
  templateUrl: './tender-delete-dialog.component.html',
})
export class TenderDeleteDialogComponent {
  tender?: ITender;

  constructor(protected tenderService: TenderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tenderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
