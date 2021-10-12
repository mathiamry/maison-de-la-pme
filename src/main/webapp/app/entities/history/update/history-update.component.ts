import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IHistory, History } from '../history.model';
import { HistoryService } from '../service/history.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-history-update',
  templateUrl: './history-update.component.html',
})
export class HistoryUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    origin: [null, [Validators.required]],
    action: [],
    actionDate: [],
    author: [null, Validators.required],
  });

  constructor(
    protected historyService: HistoryService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ history }) => {
      if (history.id === undefined) {
        const today = dayjs().startOf('day');
        history.actionDate = today;
      }

      this.updateForm(history);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const history = this.createFromForm();
    if (history.id !== undefined) {
      this.subscribeToSaveResponse(this.historyService.update(history));
    } else {
      this.subscribeToSaveResponse(this.historyService.create(history));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHistory>>): void {
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

  protected updateForm(history: IHistory): void {
    this.editForm.patchValue({
      id: history.id,
      origin: history.origin,
      action: history.action,
      actionDate: history.actionDate ? history.actionDate.format(DATE_TIME_FORMAT) : null,
      author: history.author,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, history.author);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('author')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IHistory {
    return {
      ...new History(),
      id: this.editForm.get(['id'])!.value,
      origin: this.editForm.get(['origin'])!.value,
      action: this.editForm.get(['action'])!.value,
      actionDate: this.editForm.get(['actionDate'])!.value ? dayjs(this.editForm.get(['actionDate'])!.value, DATE_TIME_FORMAT) : undefined,
      author: this.editForm.get(['author'])!.value,
    };
  }
}
