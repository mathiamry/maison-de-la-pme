import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppointmentObject } from '../appointment-object.model';
import { AppointmentObjectService } from '../service/appointment-object.service';

@Component({
  templateUrl: './appointment-object-delete-dialog.component.html',
})
export class AppointmentObjectDeleteDialogComponent {
  appointmentObject?: IAppointmentObject;

  constructor(protected appointmentObjectService: AppointmentObjectService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.appointmentObjectService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
