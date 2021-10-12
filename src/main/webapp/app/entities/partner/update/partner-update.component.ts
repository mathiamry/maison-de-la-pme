import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPartner, Partner } from '../partner.model';
import { PartnerService } from '../service/partner.service';
import { ISMEHouse } from 'app/entities/sme-house/sme-house.model';
import { SMEHouseService } from 'app/entities/sme-house/service/sme-house.service';

@Component({
  selector: 'jhi-partner-update',
  templateUrl: './partner-update.component.html',
})
export class PartnerUpdateComponent implements OnInit {
  isSaving = false;

  sMEHousesSharedCollection: ISMEHouse[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    address: [],
    email: [null, [Validators.required, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
    phone: [null, [Validators.required]],
    logo: [],
    latitude: [],
    longitude: [],
    smeHouse: [null, Validators.required],
  });

  constructor(
    protected partnerService: PartnerService,
    protected sMEHouseService: SMEHouseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partner }) => {
      this.updateForm(partner);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const partner = this.createFromForm();
    if (partner.id !== undefined) {
      this.subscribeToSaveResponse(this.partnerService.update(partner));
    } else {
      this.subscribeToSaveResponse(this.partnerService.create(partner));
    }
  }

  trackSMEHouseById(index: number, item: ISMEHouse): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPartner>>): void {
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

  protected updateForm(partner: IPartner): void {
    this.editForm.patchValue({
      id: partner.id,
      name: partner.name,
      address: partner.address,
      email: partner.email,
      phone: partner.phone,
      logo: partner.logo,
      latitude: partner.latitude,
      longitude: partner.longitude,
      smeHouse: partner.smeHouse,
    });

    this.sMEHousesSharedCollection = this.sMEHouseService.addSMEHouseToCollectionIfMissing(
      this.sMEHousesSharedCollection,
      partner.smeHouse
    );
  }

  protected loadRelationshipsOptions(): void {
    this.sMEHouseService
      .query()
      .pipe(map((res: HttpResponse<ISMEHouse[]>) => res.body ?? []))
      .pipe(
        map((sMEHouses: ISMEHouse[]) =>
          this.sMEHouseService.addSMEHouseToCollectionIfMissing(sMEHouses, this.editForm.get('smeHouse')!.value)
        )
      )
      .subscribe((sMEHouses: ISMEHouse[]) => (this.sMEHousesSharedCollection = sMEHouses));
  }

  protected createFromForm(): IPartner {
    return {
      ...new Partner(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      address: this.editForm.get(['address'])!.value,
      email: this.editForm.get(['email'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      latitude: this.editForm.get(['latitude'])!.value,
      longitude: this.editForm.get(['longitude'])!.value,
      smeHouse: this.editForm.get(['smeHouse'])!.value,
    };
  }
}
