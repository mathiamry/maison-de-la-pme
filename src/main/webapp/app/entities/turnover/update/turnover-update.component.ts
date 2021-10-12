import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITurnover, Turnover } from '../turnover.model';
import { TurnoverService } from '../service/turnover.service';

@Component({
  selector: 'jhi-turnover-update',
  templateUrl: './turnover-update.component.html',
})
export class TurnoverUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    min: [],
    max: [],
    description: [],
  });

  constructor(protected turnoverService: TurnoverService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ turnover }) => {
      this.updateForm(turnover);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const turnover = this.createFromForm();
    if (turnover.id !== undefined) {
      this.subscribeToSaveResponse(this.turnoverService.update(turnover));
    } else {
      this.subscribeToSaveResponse(this.turnoverService.create(turnover));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITurnover>>): void {
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

  protected updateForm(turnover: ITurnover): void {
    this.editForm.patchValue({
      id: turnover.id,
      min: turnover.min,
      max: turnover.max,
      description: turnover.description,
    });
  }

  protected createFromForm(): ITurnover {
    return {
      ...new Turnover(),
      id: this.editForm.get(['id'])!.value,
      min: this.editForm.get(['min'])!.value,
      max: this.editForm.get(['max'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
