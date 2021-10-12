import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUnavailabilityPeriod } from '../unavailability-period.model';
import { UnavailabilityPeriodService } from '../service/unavailability-period.service';

@Component({
  templateUrl: './unavailability-period-delete-dialog.component.html',
})
export class UnavailabilityPeriodDeleteDialogComponent {
  unavailabilityPeriod?: IUnavailabilityPeriod;

  constructor(protected unavailabilityPeriodService: UnavailabilityPeriodService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.unavailabilityPeriodService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
