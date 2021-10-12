import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISize } from '../size.model';
import { SizeService } from '../service/size.service';

@Component({
  templateUrl: './size-delete-dialog.component.html',
})
export class SizeDeleteDialogComponent {
  size?: ISize;

  constructor(protected sizeService: SizeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sizeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
