import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAvailabilityTimeslot } from '../availability-timeslot.model';

@Component({
  selector: 'jhi-availability-timeslot-detail',
  templateUrl: './availability-timeslot-detail.component.html',
})
export class AvailabilityTimeslotDetailComponent implements OnInit {
  availabilityTimeslot: IAvailabilityTimeslot | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ availabilityTimeslot }) => {
      this.availabilityTimeslot = availabilityTimeslot;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
