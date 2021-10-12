import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISme, Sme } from '../sme.model';
import { SmeService } from '../service/sme.service';
import { IActivityArea } from 'app/entities/activity-area/activity-area.model';
import { ActivityAreaService } from 'app/entities/activity-area/service/activity-area.service';
import { INeed } from 'app/entities/need/need.model';
import { NeedService } from 'app/entities/need/service/need.service';
import { ISMEHouse } from 'app/entities/sme-house/sme-house.model';
import { SMEHouseService } from 'app/entities/sme-house/service/sme-house.service';
import { ITurnover } from 'app/entities/turnover/turnover.model';
import { TurnoverService } from 'app/entities/turnover/service/turnover.service';
import { IExperience } from 'app/entities/experience/experience.model';
import { ExperienceService } from 'app/entities/experience/service/experience.service';
import { ISize } from 'app/entities/size/size.model';
import { SizeService } from 'app/entities/size/service/size.service';
import { IBank } from 'app/entities/bank/bank.model';
import { BankService } from 'app/entities/bank/service/bank.service';

@Component({
  selector: 'jhi-sme-update',
  templateUrl: './sme-update.component.html',
})
export class SmeUpdateComponent implements OnInit {
  isSaving = false;

  activityAreasSharedCollection: IActivityArea[] = [];
  needsSharedCollection: INeed[] = [];
  sMEHousesSharedCollection: ISMEHouse[] = [];
  turnoversSharedCollection: ITurnover[] = [];
  experiencesSharedCollection: IExperience[] = [];
  sizesSharedCollection: ISize[] = [];
  banksSharedCollection: IBank[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
    phone: [null, [Validators.required]],
    phone2: [],
    logo: [],
    address: [],
    latitude: [],
    longitude: [],
    webSite: [],
    smeImmatriculationNumber: [null, [Validators.required]],
    isClient: [],
    isAuthorized: [],
    termsOfUse: [],
    isValid: [],
    activityArea: [null, Validators.required],
    need: [],
    smeHouse: [null, Validators.required],
    turnover: [],
    experience: [],
    size: [],
    bank: [],
  });

  constructor(
    protected smeService: SmeService,
    protected activityAreaService: ActivityAreaService,
    protected needService: NeedService,
    protected sMEHouseService: SMEHouseService,
    protected turnoverService: TurnoverService,
    protected experienceService: ExperienceService,
    protected sizeService: SizeService,
    protected bankService: BankService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sme }) => {
      this.updateForm(sme);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sme = this.createFromForm();
    if (sme.id !== undefined) {
      this.subscribeToSaveResponse(this.smeService.update(sme));
    } else {
      this.subscribeToSaveResponse(this.smeService.create(sme));
    }
  }

  trackActivityAreaById(index: number, item: IActivityArea): number {
    return item.id!;
  }

  trackNeedById(index: number, item: INeed): number {
    return item.id!;
  }

  trackSMEHouseById(index: number, item: ISMEHouse): number {
    return item.id!;
  }

  trackTurnoverById(index: number, item: ITurnover): number {
    return item.id!;
  }

  trackExperienceById(index: number, item: IExperience): number {
    return item.id!;
  }

  trackSizeById(index: number, item: ISize): number {
    return item.id!;
  }

  trackBankById(index: number, item: IBank): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISme>>): void {
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

  protected updateForm(sme: ISme): void {
    this.editForm.patchValue({
      id: sme.id,
      name: sme.name,
      email: sme.email,
      phone: sme.phone,
      phone2: sme.phone2,
      logo: sme.logo,
      address: sme.address,
      latitude: sme.latitude,
      longitude: sme.longitude,
      webSite: sme.webSite,
      smeImmatriculationNumber: sme.smeImmatriculationNumber,
      isClient: sme.isClient,
      isAuthorized: sme.isAuthorized,
      termsOfUse: sme.termsOfUse,
      isValid: sme.isValid,
      activityArea: sme.activityArea,
      need: sme.need,
      smeHouse: sme.smeHouse,
      turnover: sme.turnover,
      experience: sme.experience,
      size: sme.size,
      bank: sme.bank,
    });

    this.activityAreasSharedCollection = this.activityAreaService.addActivityAreaToCollectionIfMissing(
      this.activityAreasSharedCollection,
      sme.activityArea
    );
    this.needsSharedCollection = this.needService.addNeedToCollectionIfMissing(this.needsSharedCollection, sme.need);
    this.sMEHousesSharedCollection = this.sMEHouseService.addSMEHouseToCollectionIfMissing(this.sMEHousesSharedCollection, sme.smeHouse);
    this.turnoversSharedCollection = this.turnoverService.addTurnoverToCollectionIfMissing(this.turnoversSharedCollection, sme.turnover);
    this.experiencesSharedCollection = this.experienceService.addExperienceToCollectionIfMissing(
      this.experiencesSharedCollection,
      sme.experience
    );
    this.sizesSharedCollection = this.sizeService.addSizeToCollectionIfMissing(this.sizesSharedCollection, sme.size);
    this.banksSharedCollection = this.bankService.addBankToCollectionIfMissing(this.banksSharedCollection, sme.bank);
  }

  protected loadRelationshipsOptions(): void {
    this.activityAreaService
      .query()
      .pipe(map((res: HttpResponse<IActivityArea[]>) => res.body ?? []))
      .pipe(
        map((activityAreas: IActivityArea[]) =>
          this.activityAreaService.addActivityAreaToCollectionIfMissing(activityAreas, this.editForm.get('activityArea')!.value)
        )
      )
      .subscribe((activityAreas: IActivityArea[]) => (this.activityAreasSharedCollection = activityAreas));

    this.needService
      .query()
      .pipe(map((res: HttpResponse<INeed[]>) => res.body ?? []))
      .pipe(map((needs: INeed[]) => this.needService.addNeedToCollectionIfMissing(needs, this.editForm.get('need')!.value)))
      .subscribe((needs: INeed[]) => (this.needsSharedCollection = needs));

    this.sMEHouseService
      .query()
      .pipe(map((res: HttpResponse<ISMEHouse[]>) => res.body ?? []))
      .pipe(
        map((sMEHouses: ISMEHouse[]) =>
          this.sMEHouseService.addSMEHouseToCollectionIfMissing(sMEHouses, this.editForm.get('smeHouse')!.value)
        )
      )
      .subscribe((sMEHouses: ISMEHouse[]) => (this.sMEHousesSharedCollection = sMEHouses));

    this.turnoverService
      .query()
      .pipe(map((res: HttpResponse<ITurnover[]>) => res.body ?? []))
      .pipe(
        map((turnovers: ITurnover[]) =>
          this.turnoverService.addTurnoverToCollectionIfMissing(turnovers, this.editForm.get('turnover')!.value)
        )
      )
      .subscribe((turnovers: ITurnover[]) => (this.turnoversSharedCollection = turnovers));

    this.experienceService
      .query()
      .pipe(map((res: HttpResponse<IExperience[]>) => res.body ?? []))
      .pipe(
        map((experiences: IExperience[]) =>
          this.experienceService.addExperienceToCollectionIfMissing(experiences, this.editForm.get('experience')!.value)
        )
      )
      .subscribe((experiences: IExperience[]) => (this.experiencesSharedCollection = experiences));

    this.sizeService
      .query()
      .pipe(map((res: HttpResponse<ISize[]>) => res.body ?? []))
      .pipe(map((sizes: ISize[]) => this.sizeService.addSizeToCollectionIfMissing(sizes, this.editForm.get('size')!.value)))
      .subscribe((sizes: ISize[]) => (this.sizesSharedCollection = sizes));

    this.bankService
      .query()
      .pipe(map((res: HttpResponse<IBank[]>) => res.body ?? []))
      .pipe(map((banks: IBank[]) => this.bankService.addBankToCollectionIfMissing(banks, this.editForm.get('bank')!.value)))
      .subscribe((banks: IBank[]) => (this.banksSharedCollection = banks));
  }

  protected createFromForm(): ISme {
    return {
      ...new Sme(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      email: this.editForm.get(['email'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      phone2: this.editForm.get(['phone2'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      address: this.editForm.get(['address'])!.value,
      latitude: this.editForm.get(['latitude'])!.value,
      longitude: this.editForm.get(['longitude'])!.value,
      webSite: this.editForm.get(['webSite'])!.value,
      smeImmatriculationNumber: this.editForm.get(['smeImmatriculationNumber'])!.value,
      isClient: this.editForm.get(['isClient'])!.value,
      isAuthorized: this.editForm.get(['isAuthorized'])!.value,
      termsOfUse: this.editForm.get(['termsOfUse'])!.value,
      isValid: this.editForm.get(['isValid'])!.value,
      activityArea: this.editForm.get(['activityArea'])!.value,
      need: this.editForm.get(['need'])!.value,
      smeHouse: this.editForm.get(['smeHouse'])!.value,
      turnover: this.editForm.get(['turnover'])!.value,
      experience: this.editForm.get(['experience'])!.value,
      size: this.editForm.get(['size'])!.value,
      bank: this.editForm.get(['bank'])!.value,
    };
  }
}
