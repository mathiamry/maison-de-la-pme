import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAppointment, Appointment } from '../appointment.model';
import { AppointmentService } from '../service/appointment.service';
import { ISmeRepresentative } from 'app/entities/sme-representative/sme-representative.model';
import { SmeRepresentativeService } from 'app/entities/sme-representative/service/sme-representative.service';
import { IAdvisor } from 'app/entities/advisor/advisor.model';
import { AdvisorService } from 'app/entities/advisor/service/advisor.service';
import { IPartnerRepresentative } from 'app/entities/partner-representative/partner-representative.model';
import { PartnerRepresentativeService } from 'app/entities/partner-representative/service/partner-representative.service';
import { Status } from 'app/entities/enumerations/status.model';
import { AppointmentLocation } from 'app/entities/enumerations/appointment-location.model';

@Component({
  selector: 'jhi-appointment-update',
  templateUrl: './appointment-update.component.html',
})
export class AppointmentUpdateComponent implements OnInit {
  isSaving = false;
  statusValues = Object.keys(Status);
  appointmentLocationValues = Object.keys(AppointmentLocation);

  smeRepresentativesSharedCollection: ISmeRepresentative[] = [];
  advisorsSharedCollection: IAdvisor[] = [];
  partnerRepresentativesSharedCollection: IPartnerRepresentative[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    description: [],
    startDate: [null, [Validators.required]],
    endDate: [null, [Validators.required]],
    status: [null, [Validators.required]],
    location: [null, [Validators.required]],
    rate: [],
    smeRepresentative: [],
    advisor: [],
    partnerRepresentative: [],
  });

  constructor(
    protected appointmentService: AppointmentService,
    protected smeRepresentativeService: SmeRepresentativeService,
    protected advisorService: AdvisorService,
    protected partnerRepresentativeService: PartnerRepresentativeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appointment }) => {
      if (appointment.id === undefined) {
        const today = dayjs().startOf('day');
        appointment.startDate = today;
        appointment.endDate = today;
      }

      this.updateForm(appointment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const appointment = this.createFromForm();
    if (appointment.id !== undefined) {
      this.subscribeToSaveResponse(this.appointmentService.update(appointment));
    } else {
      this.subscribeToSaveResponse(this.appointmentService.create(appointment));
    }
  }

  trackSmeRepresentativeById(index: number, item: ISmeRepresentative): number {
    return item.id!;
  }

  trackAdvisorById(index: number, item: IAdvisor): number {
    return item.id!;
  }

  trackPartnerRepresentativeById(index: number, item: IPartnerRepresentative): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppointment>>): void {
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

  protected updateForm(appointment: IAppointment): void {
    this.editForm.patchValue({
      id: appointment.id,
      title: appointment.title,
      description: appointment.description,
      startDate: appointment.startDate ? appointment.startDate.format(DATE_TIME_FORMAT) : null,
      endDate: appointment.endDate ? appointment.endDate.format(DATE_TIME_FORMAT) : null,
      status: appointment.status,
      location: appointment.location,
      rate: appointment.rate,
      smeRepresentative: appointment.smeRepresentative,
      advisor: appointment.advisor,
      partnerRepresentative: appointment.partnerRepresentative,
    });

    this.smeRepresentativesSharedCollection = this.smeRepresentativeService.addSmeRepresentativeToCollectionIfMissing(
      this.smeRepresentativesSharedCollection,
      appointment.smeRepresentative
    );
    this.advisorsSharedCollection = this.advisorService.addAdvisorToCollectionIfMissing(this.advisorsSharedCollection, appointment.advisor);
    this.partnerRepresentativesSharedCollection = this.partnerRepresentativeService.addPartnerRepresentativeToCollectionIfMissing(
      this.partnerRepresentativesSharedCollection,
      appointment.partnerRepresentative
    );
  }

  protected loadRelationshipsOptions(): void {
    this.smeRepresentativeService
      .query()
      .pipe(map((res: HttpResponse<ISmeRepresentative[]>) => res.body ?? []))
      .pipe(
        map((smeRepresentatives: ISmeRepresentative[]) =>
          this.smeRepresentativeService.addSmeRepresentativeToCollectionIfMissing(
            smeRepresentatives,
            this.editForm.get('smeRepresentative')!.value
          )
        )
      )
      .subscribe((smeRepresentatives: ISmeRepresentative[]) => (this.smeRepresentativesSharedCollection = smeRepresentatives));

    this.advisorService
      .query()
      .pipe(map((res: HttpResponse<IAdvisor[]>) => res.body ?? []))
      .pipe(
        map((advisors: IAdvisor[]) => this.advisorService.addAdvisorToCollectionIfMissing(advisors, this.editForm.get('advisor')!.value))
      )
      .subscribe((advisors: IAdvisor[]) => (this.advisorsSharedCollection = advisors));

    this.partnerRepresentativeService
      .query()
      .pipe(map((res: HttpResponse<IPartnerRepresentative[]>) => res.body ?? []))
      .pipe(
        map((partnerRepresentatives: IPartnerRepresentative[]) =>
          this.partnerRepresentativeService.addPartnerRepresentativeToCollectionIfMissing(
            partnerRepresentatives,
            this.editForm.get('partnerRepresentative')!.value
          )
        )
      )
      .subscribe(
        (partnerRepresentatives: IPartnerRepresentative[]) => (this.partnerRepresentativesSharedCollection = partnerRepresentatives)
      );
  }

  protected createFromForm(): IAppointment {
    return {
      ...new Appointment(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      startDate: this.editForm.get(['startDate'])!.value ? dayjs(this.editForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : undefined,
      endDate: this.editForm.get(['endDate'])!.value ? dayjs(this.editForm.get(['endDate'])!.value, DATE_TIME_FORMAT) : undefined,
      status: this.editForm.get(['status'])!.value,
      location: this.editForm.get(['location'])!.value,
      rate: this.editForm.get(['rate'])!.value,
      smeRepresentative: this.editForm.get(['smeRepresentative'])!.value,
      advisor: this.editForm.get(['advisor'])!.value,
      partnerRepresentative: this.editForm.get(['partnerRepresentative'])!.value,
    };
  }
}
