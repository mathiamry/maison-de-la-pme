import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INeed } from '../need.model';
import { NeedService } from '../service/need.service';

@Component({
  templateUrl: './need-delete-dialog.component.html',
})
export class NeedDeleteDialogComponent {
  need?: INeed;

  constructor(protected needService: NeedService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.needService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
