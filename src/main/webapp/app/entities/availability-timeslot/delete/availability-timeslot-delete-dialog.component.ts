import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAvailabilityTimeslot } from '../availability-timeslot.model';
import { AvailabilityTimeslotService } from '../service/availability-timeslot.service';

@Component({
  templateUrl: './availability-timeslot-delete-dialog.component.html',
})
export class AvailabilityTimeslotDeleteDialogComponent {
  availabilityTimeslot?: IAvailabilityTimeslot;

  constructor(protected availabilityTimeslotService: AvailabilityTimeslotService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.availabilityTimeslotService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
