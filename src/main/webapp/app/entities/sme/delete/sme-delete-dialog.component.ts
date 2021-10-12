import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISme } from '../sme.model';
import { SmeService } from '../service/sme.service';

@Component({
  templateUrl: './sme-delete-dialog.component.html',
})
export class SmeDeleteDialogComponent {
  sme?: ISme;

  constructor(protected smeService: SmeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.smeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
