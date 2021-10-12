import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUnavailabilityPeriod } from '../unavailability-period.model';

@Component({
  selector: 'jhi-unavailability-period-detail',
  templateUrl: './unavailability-period-detail.component.html',
})
export class UnavailabilityPeriodDetailComponent implements OnInit {
  unavailabilityPeriod: IUnavailabilityPeriod | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ unavailabilityPeriod }) => {
      this.unavailabilityPeriod = unavailabilityPeriod;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
