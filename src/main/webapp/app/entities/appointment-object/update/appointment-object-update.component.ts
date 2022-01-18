import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAppointmentObject, AppointmentObject } from '../appointment-object.model';
import { AppointmentObjectService } from '../service/appointment-object.service';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

@Component({
  selector: 'jhi-appointment-object-update',
  templateUrl: './appointment-object-update.component.html',
})
export class AppointmentObjectUpdateComponent implements OnInit {
  isSaving = false;

  appointmentsSharedCollection: IAppointment[] = [];

  editForm = this.fb.group({
    id: [],
    object: [null, [Validators.required]],
    object: [null, Validators.required],
  });

  constructor(
    protected appointmentObjectService: AppointmentObjectService,
    protected appointmentService: AppointmentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appointmentObject }) => {
      this.updateForm(appointmentObject);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const appointmentObject = this.createFromForm();
    if (appointmentObject.id !== undefined) {
      this.subscribeToSaveResponse(this.appointmentObjectService.update(appointmentObject));
    } else {
      this.subscribeToSaveResponse(this.appointmentObjectService.create(appointmentObject));
    }
  }

  trackAppointmentById(index: number, item: IAppointment): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppointmentObject>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(appointmentObject: IAppointmentObject): void {
    this.editForm.patchValue({
      id: appointmentObject.id,
      object: appointmentObject.object,
      object: appointmentObject.object,
    });

    this.appointmentsSharedCollection = this.appointmentService.addAppointmentToCollectionIfMissing(
      this.appointmentsSharedCollection,
      appointmentObject.object
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appointmentService
      .query()
      .pipe(map((res: HttpResponse<IAppointment[]>) => res.body ?? []))
      .pipe(
        map((appointments: IAppointment[]) =>
          this.appointmentService.addAppointmentToCollectionIfMissing(appointments, this.editForm.get('object')!.value)
        )
      )
      .subscribe((appointments: IAppointment[]) => (this.appointmentsSharedCollection = appointments));
  }

  protected createFromForm(): IAppointmentObject {
    return {
      ...new AppointmentObject(),
      id: this.editForm.get(['id'])!.value,
      object: this.editForm.get(['object'])!.value,
      object: this.editForm.get(['object'])!.value,
    };
  }
}
