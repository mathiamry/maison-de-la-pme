import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFile, File } from '../file.model';
import { FileService } from '../service/file.service';
import { ITender } from 'app/entities/tender/tender.model';
import { TenderService } from 'app/entities/tender/service/tender.service';
import { ISme } from 'app/entities/sme/sme.model';
import { SmeService } from 'app/entities/sme/service/sme.service';

@Component({
  selector: 'jhi-file-update',
  templateUrl: './file-update.component.html',
})
export class FileUpdateComponent implements OnInit {
  isSaving = false;

  tendersSharedCollection: ITender[] = [];
  smesSharedCollection: ISme[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    url: [null, [Validators.required]],
    tender: [],
    sme: [],
  });

  constructor(
    protected fileService: FileService,
    protected tenderService: TenderService,
    protected smeService: SmeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ file }) => {
      this.updateForm(file);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const file = this.createFromForm();
    if (file.id !== undefined) {
      this.subscribeToSaveResponse(this.fileService.update(file));
    } else {
      this.subscribeToSaveResponse(this.fileService.create(file));
    }
  }

  trackTenderById(index: number, item: ITender): number {
    return item.id!;
  }

  trackSmeById(index: number, item: ISme): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFile>>): void {
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

  protected updateForm(file: IFile): void {
    this.editForm.patchValue({
      id: file.id,
      name: file.name,
      url: file.url,
      tender: file.tender,
      sme: file.sme,
    });

    this.tendersSharedCollection = this.tenderService.addTenderToCollectionIfMissing(this.tendersSharedCollection, file.tender);
    this.smesSharedCollection = this.smeService.addSmeToCollectionIfMissing(this.smesSharedCollection, file.sme);
  }

  protected loadRelationshipsOptions(): void {
    this.tenderService
      .query()
      .pipe(map((res: HttpResponse<ITender[]>) => res.body ?? []))
      .pipe(map((tenders: ITender[]) => this.tenderService.addTenderToCollectionIfMissing(tenders, this.editForm.get('tender')!.value)))
      .subscribe((tenders: ITender[]) => (this.tendersSharedCollection = tenders));

    this.smeService
      .query()
      .pipe(map((res: HttpResponse<ISme[]>) => res.body ?? []))
      .pipe(map((smes: ISme[]) => this.smeService.addSmeToCollectionIfMissing(smes, this.editForm.get('sme')!.value)))
      .subscribe((smes: ISme[]) => (this.smesSharedCollection = smes));
  }

  protected createFromForm(): IFile {
    return {
      ...new File(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      url: this.editForm.get(['url'])!.value,
      tender: this.editForm.get(['tender'])!.value,
      sme: this.editForm.get(['sme'])!.value,
    };
  }
}
