import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivityArea } from '../activity-area.model';
import { ActivityAreaService } from '../service/activity-area.service';

@Component({
  templateUrl: './activity-area-delete-dialog.component.html',
})
export class ActivityAreaDeleteDialogComponent {
  activityArea?: IActivityArea;

  constructor(protected activityAreaService: ActivityAreaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.activityAreaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
