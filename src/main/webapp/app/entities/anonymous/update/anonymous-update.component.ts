import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAnonymous, Anonymous } from '../anonymous.model';
import { AnonymousService } from '../service/anonymous.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

@Component({
  selector: 'jhi-anonymous-update',
  templateUrl: './anonymous-update.component.html',
})
export class AnonymousUpdateComponent implements OnInit {
  isSaving = false;

  peopleCollection: IPerson[] = [];
  appointmentsSharedCollection: IAppointment[] = [];

  editForm = this.fb.group({
    id: [],
    visitDate: [null, [Validators.required]],
    person: [null, Validators.required],
    appointments: [],
  });

  constructor(
    protected anonymousService: AnonymousService,
    protected personService: PersonService,
    protected appointmentService: AppointmentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ anonymous }) => {
      if (anonymous.id === undefined) {
        const today = dayjs().startOf('day');
        anonymous.visitDate = today;
      }

      this.updateForm(anonymous);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const anonymous = this.createFromForm();
    if (anonymous.id !== undefined) {
      this.subscribeToSaveResponse(this.anonymousService.update(anonymous));
    } else {
      this.subscribeToSaveResponse(this.anonymousService.create(anonymous));
    }
  }

  trackPersonById(index: number, item: IPerson): number {
    return item.id!;
  }

  trackAppointmentById(index: number, item: IAppointment): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnonymous>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
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

  protected updateForm(anonymous: IAnonymous): void {
    this.editForm.patchValue({
      id: anonymous.id,
      visitDate: anonymous.visitDate ? anonymous.visitDate.format(DATE_TIME_FORMAT) : null,
      person: anonymous.person,
      appointments: anonymous.appointments,
    });

    this.peopleCollection = this.personService.addPersonToCollectionIfMissing(this.peopleCollection, anonymous.person);
    this.appointmentsSharedCollection = this.appointmentService.addAppointmentToCollectionIfMissing(
      this.appointmentsSharedCollection,
      anonymous.appointments
    );
  }

  protected loadRelationshipsOptions(): void {
    this.personService
      .query({ filter: 'anonymous-is-null' })
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(map((people: IPerson[]) => this.personService.addPersonToCollectionIfMissing(people, this.editForm.get('person')!.value)))
      .subscribe((people: IPerson[]) => (this.peopleCollection = people));

    this.appointmentService
      .query()
      .pipe(map((res: HttpResponse<IAppointment[]>) => res.body ?? []))
      .pipe(
        map((appointments: IAppointment[]) =>
          this.appointmentService.addAppointmentToCollectionIfMissing(appointments, this.editForm.get('appointments')!.value)
        )
      )
      .subscribe((appointments: IAppointment[]) => (this.appointmentsSharedCollection = appointments));
  }

  protected createFromForm(): IAnonymous {
    return {
      ...new Anonymous(),
      id: this.editForm.get(['id'])!.value,
      visitDate: this.editForm.get(['visitDate'])!.value ? dayjs(this.editForm.get(['visitDate'])!.value, DATE_TIME_FORMAT) : undefined,
      person: this.editForm.get(['person'])!.value,
      appointments: this.editForm.get(['appointments'])!.value,
    };
  }
}
