import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITurnover } from '../turnover.model';
import { TurnoverService } from '../service/turnover.service';

@Component({
  templateUrl: './turnover-delete-dialog.component.html',
})
export class TurnoverDeleteDialogComponent {
  turnover?: ITurnover;

  constructor(protected turnoverService: TurnoverService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.turnoverService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
