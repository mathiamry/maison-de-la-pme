import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAppointmentObject, AppointmentObject } from '../appointment-object.model';
import { AppointmentObjectService } from '../service/appointment-object.service';

@Component({
  selector: 'jhi-appointment-object-update',
  templateUrl: './appointment-object-update.component.html',
})
export class AppointmentObjectUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    object: [null, [Validators.required]],
  });

  constructor(
    protected appointmentObjectService: AppointmentObjectService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appointmentObject }) => {
      this.updateForm(appointmentObject);
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
    });
  }

  protected createFromForm(): IAppointmentObject {
    return {
      ...new AppointmentObject(),
      id: this.editForm.get(['id'])!.value,
      object: this.editForm.get(['object'])!.value,
    };
  }
}
