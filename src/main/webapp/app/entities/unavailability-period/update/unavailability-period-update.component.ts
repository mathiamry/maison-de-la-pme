import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IUnavailabilityPeriod, UnavailabilityPeriod } from '../unavailability-period.model';
import { UnavailabilityPeriodService } from '../service/unavailability-period.service';
import { IAdvisor } from 'app/entities/advisor/advisor.model';
import { AdvisorService } from 'app/entities/advisor/service/advisor.service';
import { IPartnerRepresentative } from 'app/entities/partner-representative/partner-representative.model';
import { PartnerRepresentativeService } from 'app/entities/partner-representative/service/partner-representative.service';

@Component({
  selector: 'jhi-unavailability-period-update',
  templateUrl: './unavailability-period-update.component.html',
})
export class UnavailabilityPeriodUpdateComponent implements OnInit {
  isSaving = false;

  advisorsSharedCollection: IAdvisor[] = [];
  partnerRepresentativesSharedCollection: IPartnerRepresentative[] = [];

  editForm = this.fb.group({
    id: [],
    startTime: [],
    endTime: [],
    advisors: [],
    partnerRepresentatives: [],
  });

  constructor(
    protected unavailabilityPeriodService: UnavailabilityPeriodService,
    protected advisorService: AdvisorService,
    protected partnerRepresentativeService: PartnerRepresentativeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ unavailabilityPeriod }) => {
      if (unavailabilityPeriod.id === undefined) {
        const today = dayjs().startOf('day');
        unavailabilityPeriod.startTime = today;
        unavailabilityPeriod.endTime = today;
      }

      this.updateForm(unavailabilityPeriod);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const unavailabilityPeriod = this.createFromForm();
    if (unavailabilityPeriod.id !== undefined) {
      this.subscribeToSaveResponse(this.unavailabilityPeriodService.update(unavailabilityPeriod));
    } else {
      this.subscribeToSaveResponse(this.unavailabilityPeriodService.create(unavailabilityPeriod));
    }
  }

  trackAdvisorById(index: number, item: IAdvisor): number {
    return item.id!;
  }

  trackPartnerRepresentativeById(index: number, item: IPartnerRepresentative): number {
    return item.id!;
  }

  getSelectedAdvisor(option: IAdvisor, selectedVals?: IAdvisor[]): IAdvisor {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedPartnerRepresentative(option: IPartnerRepresentative, selectedVals?: IPartnerRepresentative[]): IPartnerRepresentative {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUnavailabilityPeriod>>): void {
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

  protected updateForm(unavailabilityPeriod: IUnavailabilityPeriod): void {
    this.editForm.patchValue({
      id: unavailabilityPeriod.id,
      startTime: unavailabilityPeriod.startTime ? unavailabilityPeriod.startTime.format(DATE_TIME_FORMAT) : null,
      endTime: unavailabilityPeriod.endTime ? unavailabilityPeriod.endTime.format(DATE_TIME_FORMAT) : null,
      advisors: unavailabilityPeriod.advisors,
      partnerRepresentatives: unavailabilityPeriod.partnerRepresentatives,
    });

    this.advisorsSharedCollection = this.advisorService.addAdvisorToCollectionIfMissing(
      this.advisorsSharedCollection,
      ...(unavailabilityPeriod.advisors ?? [])
    );
    this.partnerRepresentativesSharedCollection = this.partnerRepresentativeService.addPartnerRepresentativeToCollectionIfMissing(
      this.partnerRepresentativesSharedCollection,
      ...(unavailabilityPeriod.partnerRepresentatives ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.advisorService
      .query()
      .pipe(map((res: HttpResponse<IAdvisor[]>) => res.body ?? []))
      .pipe(
        map((advisors: IAdvisor[]) =>
          this.advisorService.addAdvisorToCollectionIfMissing(advisors, ...(this.editForm.get('advisors')!.value ?? []))
        )
      )
      .subscribe((advisors: IAdvisor[]) => (this.advisorsSharedCollection = advisors));

    this.partnerRepresentativeService
      .query()
      .pipe(map((res: HttpResponse<IPartnerRepresentative[]>) => res.body ?? []))
      .pipe(
        map((partnerRepresentatives: IPartnerRepresentative[]) =>
          this.partnerRepresentativeService.addPartnerRepresentativeToCollectionIfMissing(
            partnerRepresentatives,
            ...(this.editForm.get('partnerRepresentatives')!.value ?? [])
          )
        )
      )
      .subscribe(
        (partnerRepresentatives: IPartnerRepresentative[]) => (this.partnerRepresentativesSharedCollection = partnerRepresentatives)
      );
  }

  protected createFromForm(): IUnavailabilityPeriod {
    return {
      ...new UnavailabilityPeriod(),
      id: this.editForm.get(['id'])!.value,
      startTime: this.editForm.get(['startTime'])!.value ? dayjs(this.editForm.get(['startTime'])!.value, DATE_TIME_FORMAT) : undefined,
      endTime: this.editForm.get(['endTime'])!.value ? dayjs(this.editForm.get(['endTime'])!.value, DATE_TIME_FORMAT) : undefined,
      advisors: this.editForm.get(['advisors'])!.value,
      partnerRepresentatives: this.editForm.get(['partnerRepresentatives'])!.value,
    };
  }
}
