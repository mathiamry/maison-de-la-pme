import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBank, Bank } from '../bank.model';
import { BankService } from '../service/bank.service';
import { ISme } from 'app/entities/sme/sme.model';
import { SmeService } from 'app/entities/sme/service/sme.service';

@Component({
  selector: 'jhi-bank-update',
  templateUrl: './bank-update.component.html',
})
export class BankUpdateComponent implements OnInit {
  isSaving = false;

  smesSharedCollection: ISme[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [],
    smes: [],
  });

  constructor(
    protected bankService: BankService,
    protected smeService: SmeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bank }) => {
      this.updateForm(bank);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bank = this.createFromForm();
    if (bank.id !== undefined) {
      this.subscribeToSaveResponse(this.bankService.update(bank));
    } else {
      this.subscribeToSaveResponse(this.bankService.create(bank));
    }
  }

  trackSmeById(index: number, item: ISme): number {
    return item.id!;
  }

  getSelectedSme(option: ISme, selectedVals?: ISme[]): ISme {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBank>>): void {
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

  protected updateForm(bank: IBank): void {
    this.editForm.patchValue({
      id: bank.id,
      name: bank.name,
      description: bank.description,
      smes: bank.smes,
    });

    this.smesSharedCollection = this.smeService.addSmeToCollectionIfMissing(this.smesSharedCollection, ...(bank.smes ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.smeService
      .query()
      .pipe(map((res: HttpResponse<ISme[]>) => res.body ?? []))
      .pipe(map((smes: ISme[]) => this.smeService.addSmeToCollectionIfMissing(smes, ...(this.editForm.get('smes')!.value ?? []))))
      .subscribe((smes: ISme[]) => (this.smesSharedCollection = smes));
  }

  protected createFromForm(): IBank {
    return {
      ...new Bank(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      smes: this.editForm.get(['smes'])!.value,
    };
  }
}
