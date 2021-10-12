import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUnavailabilityPeriod } from '../unavailability-period.model';
import { UnavailabilityPeriodService } from '../service/unavailability-period.service';
import { UnavailabilityPeriodDeleteDialogComponent } from '../delete/unavailability-period-delete-dialog.component';

@Component({
  selector: 'jhi-unavailability-period',
  templateUrl: './unavailability-period.component.html',
})
export class UnavailabilityPeriodComponent implements OnInit {
  unavailabilityPeriods?: IUnavailabilityPeriod[];
  isLoading = false;

  constructor(protected unavailabilityPeriodService: UnavailabilityPeriodService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.unavailabilityPeriodService.query().subscribe(
      (res: HttpResponse<IUnavailabilityPeriod[]>) => {
        this.isLoading = false;
        this.unavailabilityPeriods = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUnavailabilityPeriod): number {
    return item.id!;
  }

  delete(unavailabilityPeriod: IUnavailabilityPeriod): void {
    const modalRef = this.modalService.open(UnavailabilityPeriodDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.unavailabilityPeriod = unavailabilityPeriod;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
