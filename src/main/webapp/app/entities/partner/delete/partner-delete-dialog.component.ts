import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPartner } from '../partner.model';
import { PartnerService } from '../service/partner.service';

@Component({
  templateUrl: './partner-delete-dialog.component.html',
})
export class PartnerDeleteDialogComponent {
  partner?: IPartner;

  constructor(protected partnerService: PartnerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.partnerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
