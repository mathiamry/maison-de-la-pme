import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICountry, Country } from '../country.model';
import { CountryService } from '../service/country.service';
import { ILanguage } from 'app/entities/language/language.model';
import { LanguageService } from 'app/entities/language/service/language.service';

@Component({
  selector: 'jhi-country-update',
  templateUrl: './country-update.component.html',
})
export class CountryUpdateComponent implements OnInit {
  isSaving = false;

  languagesSharedCollection: ILanguage[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    language: [],
  });

  constructor(
    protected countryService: CountryService,
    protected languageService: LanguageService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ country }) => {
      this.updateForm(country);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const country = this.createFromForm();
    if (country.id !== undefined) {
      this.subscribeToSaveResponse(this.countryService.update(country));
    } else {
      this.subscribeToSaveResponse(this.countryService.create(country));
    }
  }

  trackLanguageById(index: number, item: ILanguage): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICountry>>): void {
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

  protected updateForm(country: ICountry): void {
    this.editForm.patchValue({
      id: country.id,
      name: country.name,
      language: country.language,
    });

    this.languagesSharedCollection = this.languageService.addLanguageToCollectionIfMissing(
      this.languagesSharedCollection,
      country.language
    );
  }

  protected loadRelationshipsOptions(): void {
    this.languageService
      .query()
      .pipe(map((res: HttpResponse<ILanguage[]>) => res.body ?? []))
      .pipe(
        map((languages: ILanguage[]) =>
          this.languageService.addLanguageToCollectionIfMissing(languages, this.editForm.get('language')!.value)
        )
      )
      .subscribe((languages: ILanguage[]) => (this.languagesSharedCollection = languages));
  }

  protected createFromForm(): ICountry {
    return {
      ...new Country(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      language: this.editForm.get(['language'])!.value,
    };
  }
}
