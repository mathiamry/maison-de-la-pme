import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISMEHouse, SMEHouse } from '../sme-house.model';
import { SMEHouseService } from '../service/sme-house.service';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';
import { IAdministrator } from 'app/entities/administrator/administrator.model';
import { AdministratorService } from 'app/entities/administrator/service/administrator.service';

@Component({
  selector: 'jhi-sme-house-update',
  templateUrl: './sme-house-update.component.html',
})
export class SMEHouseUpdateComponent implements OnInit {
  isSaving = false;

  countriesSharedCollection: ICountry[] = [];
  administratorsSharedCollection: IAdministrator[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [],
    address: [],
    email: [null, [Validators.required, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
    phone: [null, [Validators.required]],
    country: [null, Validators.required],
    administrator: [null, Validators.required],
  });

  constructor(
    protected sMEHouseService: SMEHouseService,
    protected countryService: CountryService,
    protected administratorService: AdministratorService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sMEHouse }) => {
      this.updateForm(sMEHouse);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sMEHouse = this.createFromForm();
    if (sMEHouse.id !== undefined) {
      this.subscribeToSaveResponse(this.sMEHouseService.update(sMEHouse));
    } else {
      this.subscribeToSaveResponse(this.sMEHouseService.create(sMEHouse));
    }
  }

  trackCountryById(index: number, item: ICountry): number {
    return item.id!;
  }

  trackAdministratorById(index: number, item: IAdministrator): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISMEHouse>>): void {
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

  protected updateForm(sMEHouse: ISMEHouse): void {
    this.editForm.patchValue({
      id: sMEHouse.id,
      name: sMEHouse.name,
      description: sMEHouse.description,
      address: sMEHouse.address,
      email: sMEHouse.email,
      phone: sMEHouse.phone,
      country: sMEHouse.country,
      administrator: sMEHouse.administrator,
    });

    this.countriesSharedCollection = this.countryService.addCountryToCollectionIfMissing(this.countriesSharedCollection, sMEHouse.country);
    this.administratorsSharedCollection = this.administratorService.addAdministratorToCollectionIfMissing(
      this.administratorsSharedCollection,
      sMEHouse.administrator
    );
  }

  protected loadRelationshipsOptions(): void {
    this.countryService
      .query()
      .pipe(map((res: HttpResponse<ICountry[]>) => res.body ?? []))
      .pipe(
        map((countries: ICountry[]) => this.countryService.addCountryToCollectionIfMissing(countries, this.editForm.get('country')!.value))
      )
      .subscribe((countries: ICountry[]) => (this.countriesSharedCollection = countries));

    this.administratorService
      .query()
      .pipe(map((res: HttpResponse<IAdministrator[]>) => res.body ?? []))
      .pipe(
        map((administrators: IAdministrator[]) =>
          this.administratorService.addAdministratorToCollectionIfMissing(administrators, this.editForm.get('administrator')!.value)
        )
      )
      .subscribe((administrators: IAdministrator[]) => (this.administratorsSharedCollection = administrators));
  }

  protected createFromForm(): ISMEHouse {
    return {
      ...new SMEHouse(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      address: this.editForm.get(['address'])!.value,
      email: this.editForm.get(['email'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      country: this.editForm.get(['country'])!.value,
      administrator: this.editForm.get(['administrator'])!.value,
    };
  }
}
