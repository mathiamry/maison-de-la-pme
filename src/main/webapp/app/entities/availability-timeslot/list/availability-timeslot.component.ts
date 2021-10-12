import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAvailabilityTimeslot } from '../availability-timeslot.model';
import { AvailabilityTimeslotService } from '../service/availability-timeslot.service';
import { AvailabilityTimeslotDeleteDialogComponent } from '../delete/availability-timeslot-delete-dialog.component';

@Component({
  selector: 'jhi-availability-timeslot',
  templateUrl: './availability-timeslot.component.html',
})
export class AvailabilityTimeslotComponent implements OnInit {
  availabilityTimeslots?: IAvailabilityTimeslot[];
  isLoading = false;

  constructor(protected availabilityTimeslotService: AvailabilityTimeslotService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.availabilityTimeslotService.query().subscribe(
      (res: HttpResponse<IAvailabilityTimeslot[]>) => {
        this.isLoading = false;
        this.availabilityTimeslots = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAvailabilityTimeslot): number {
    return item.id!;
  }

  delete(availabilityTimeslot: IAvailabilityTimeslot): void {
    const modalRef = this.modalService.open(AvailabilityTimeslotDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.availabilityTimeslot = availabilityTimeslot;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
