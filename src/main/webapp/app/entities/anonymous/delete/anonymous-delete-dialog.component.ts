import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnonymous } from '../anonymous.model';
import { AnonymousService } from '../service/anonymous.service';

@Component({
  templateUrl: './anonymous-delete-dialog.component.html',
})
export class AnonymousDeleteDialogComponent {
  anonymous?: IAnonymous;

  constructor(protected anonymousService: AnonymousService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.anonymousService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
