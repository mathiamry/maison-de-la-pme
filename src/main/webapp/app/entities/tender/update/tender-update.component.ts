import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ITender, Tender } from '../tender.model';
import { TenderService } from '../service/tender.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-tender-update',
  templateUrl: './tender-update.component.html',
})
export class TenderUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    description: [],
    publishDate: [],
    expiryDate: [],
    isValid: [],
    isArchived: [],
    isPublished: [],
    author: [null, Validators.required],
  });

  constructor(
    protected tenderService: TenderService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tender }) => {
      if (tender.id === undefined) {
        const today = dayjs().startOf('day');
        tender.publishDate = today;
        tender.expiryDate = today;
      }

      this.updateForm(tender);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tender = this.createFromForm();
    if (tender.id !== undefined) {
      this.subscribeToSaveResponse(this.tenderService.update(tender));
    } else {
      this.subscribeToSaveResponse(this.tenderService.create(tender));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITender>>): void {
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

  protected updateForm(tender: ITender): void {
    this.editForm.patchValue({
      id: tender.id,
      title: tender.title,
      description: tender.description,
      publishDate: tender.publishDate ? tender.publishDate.format(DATE_TIME_FORMAT) : null,
      expiryDate: tender.expiryDate ? tender.expiryDate.format(DATE_TIME_FORMAT) : null,
      isValid: tender.isValid,
      isArchived: tender.isArchived,
      isPublished: tender.isPublished,
      author: tender.author,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, tender.author);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('author')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): ITender {
    return {
      ...new Tender(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      publishDate: this.editForm.get(['publishDate'])!.value
        ? dayjs(this.editForm.get(['publishDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      expiryDate: this.editForm.get(['expiryDate'])!.value ? dayjs(this.editForm.get(['expiryDate'])!.value, DATE_TIME_FORMAT) : undefined,
      isValid: this.editForm.get(['isValid'])!.value,
      isArchived: this.editForm.get(['isArchived'])!.value,
      isPublished: this.editForm.get(['isPublished'])!.value,
      author: this.editForm.get(['author'])!.value,
    };
  }
}
