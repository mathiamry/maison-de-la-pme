import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISmeRepresentative } from '../sme-representative.model';
import { SmeRepresentativeService } from '../service/sme-representative.service';

@Component({
  templateUrl: './sme-representative-delete-dialog.component.html',
})
export class SmeRepresentativeDeleteDialogComponent {
  smeRepresentative?: ISmeRepresentative;

  constructor(protected smeRepresentativeService: SmeRepresentativeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.smeRepresentativeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
