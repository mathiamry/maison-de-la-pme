import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppointmentObject } from '../appointment-object.model';
import { AppointmentObjectService } from '../service/appointment-object.service';
import { AppointmentObjectDeleteDialogComponent } from '../delete/appointment-object-delete-dialog.component';

@Component({
  selector: 'jhi-appointment-object',
  templateUrl: './appointment-object.component.html',
})
export class AppointmentObjectComponent implements OnInit {
  appointmentObjects?: IAppointmentObject[];
  isLoading = false;

  constructor(protected appointmentObjectService: AppointmentObjectService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.appointmentObjectService.query().subscribe({
      next: (res: HttpResponse<IAppointmentObject[]>) => {
        this.isLoading = false;
        this.appointmentObjects = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAppointmentObject): number {
    return item.id!;
  }

  delete(appointmentObject: IAppointmentObject): void {
    const modalRef = this.modalService.open(AppointmentObjectDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.appointmentObject = appointmentObject;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
