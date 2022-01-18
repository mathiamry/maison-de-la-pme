import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAppointmentObject } from '../appointment-object.model';

@Component({
  selector: 'jhi-appointment-object-detail',
  templateUrl: './appointment-object-detail.component.html',
})
export class AppointmentObjectDetailComponent implements OnInit {
  appointmentObject: IAppointmentObject | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appointmentObject }) => {
      this.appointmentObject = appointmentObject;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
