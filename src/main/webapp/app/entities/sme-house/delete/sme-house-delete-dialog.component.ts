import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISMEHouse } from '../sme-house.model';
import { SMEHouseService } from '../service/sme-house.service';

@Component({
  templateUrl: './sme-house-delete-dialog.component.html',
})
export class SMEHouseDeleteDialogComponent {
  sMEHouse?: ISMEHouse;

  constructor(protected sMEHouseService: SMEHouseService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sMEHouseService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
