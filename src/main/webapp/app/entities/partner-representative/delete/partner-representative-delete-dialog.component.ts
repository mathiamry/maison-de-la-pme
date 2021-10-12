import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPartnerRepresentative } from '../partner-representative.model';
import { PartnerRepresentativeService } from '../service/partner-representative.service';

@Component({
  templateUrl: './partner-representative-delete-dialog.component.html',
})
export class PartnerRepresentativeDeleteDialogComponent {
  partnerRepresentative?: IPartnerRepresentative;

  constructor(protected partnerRepresentativeService: PartnerRepresentativeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.partnerRepresentativeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
