import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAvailabilityTimeslot, AvailabilityTimeslot } from '../availability-timeslot.model';
import { AvailabilityTimeslotService } from '../service/availability-timeslot.service';
import { IAdvisor } from 'app/entities/advisor/advisor.model';
import { AdvisorService } from 'app/entities/advisor/service/advisor.service';
import { IPartnerRepresentative } from 'app/entities/partner-representative/partner-representative.model';
import { PartnerRepresentativeService } from 'app/entities/partner-representative/service/partner-representative.service';
import { Day } from 'app/entities/enumerations/day.model';

@Component({
  selector: 'jhi-availability-timeslot-update',
  templateUrl: './availability-timeslot-update.component.html',
})
export class AvailabilityTimeslotUpdateComponent implements OnInit {
  isSaving = false;
  dayValues = Object.keys(Day);

  advisorsSharedCollection: IAdvisor[] = [];
  partnerRepresentativesSharedCollection: IPartnerRepresentative[] = [];

  editForm = this.fb.group({
    id: [],
    startHour: [null, [Validators.required]],
    startMin: [null, [Validators.required]],
    endHour: [null, [Validators.required]],
    endMin: [null, [Validators.required]],
    day: [null, [Validators.required]],
    advisors: [],
    partnerRepresentatives: [],
  });

  constructor(
    protected availabilityTimeslotService: AvailabilityTimeslotService,
    protected advisorService: AdvisorService,
    protected partnerRepresentativeService: PartnerRepresentativeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ availabilityTimeslot }) => {
      this.updateForm(availabilityTimeslot);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const availabilityTimeslot = this.createFromForm();
    if (availabilityTimeslot.id !== undefined) {
      this.subscribeToSaveResponse(this.availabilityTimeslotService.update(availabilityTimeslot));
    } else {
      this.subscribeToSaveResponse(this.availabilityTimeslotService.create(availabilityTimeslot));
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAvailabilityTimeslot>>): void {
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

  protected updateForm(availabilityTimeslot: IAvailabilityTimeslot): void {
    this.editForm.patchValue({
      id: availabilityTimeslot.id,
      startHour: availabilityTimeslot.startHour,
      startMin: availabilityTimeslot.startMin,
      endHour: availabilityTimeslot.endHour,
      endMin: availabilityTimeslot.endMin,
      day: availabilityTimeslot.day,
      advisors: availabilityTimeslot.advisors,
      partnerRepresentatives: availabilityTimeslot.partnerRepresentatives,
    });

    this.advisorsSharedCollection = this.advisorService.addAdvisorToCollectionIfMissing(
      this.advisorsSharedCollection,
      ...(availabilityTimeslot.advisors ?? [])
    );
    this.partnerRepresentativesSharedCollection = this.partnerRepresentativeService.addPartnerRepresentativeToCollectionIfMissing(
      this.partnerRepresentativesSharedCollection,
      ...(availabilityTimeslot.partnerRepresentatives ?? [])
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

  protected createFromForm(): IAvailabilityTimeslot {
    return {
      ...new AvailabilityTimeslot(),
      id: this.editForm.get(['id'])!.value,
      startHour: this.editForm.get(['startHour'])!.value,
      startMin: this.editForm.get(['startMin'])!.value,
      endHour: this.editForm.get(['endHour'])!.value,
      endMin: this.editForm.get(['endMin'])!.value,
      day: this.editForm.get(['day'])!.value,
      advisors: this.editForm.get(['advisors'])!.value,
      partnerRepresentatives: this.editForm.get(['partnerRepresentatives'])!.value,
    };
  }
}
