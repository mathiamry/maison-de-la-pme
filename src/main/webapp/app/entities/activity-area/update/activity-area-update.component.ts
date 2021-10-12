import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IActivityArea, ActivityArea } from '../activity-area.model';
import { ActivityAreaService } from '../service/activity-area.service';

@Component({
  selector: 'jhi-activity-area-update',
  templateUrl: './activity-area-update.component.html',
})
export class ActivityAreaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
  });

  constructor(protected activityAreaService: ActivityAreaService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activityArea }) => {
      this.updateForm(activityArea);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const activityArea = this.createFromForm();
    if (activityArea.id !== undefined) {
      this.subscribeToSaveResponse(this.activityAreaService.update(activityArea));
    } else {
      this.subscribeToSaveResponse(this.activityAreaService.create(activityArea));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivityArea>>): void {
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

  protected updateForm(activityArea: IActivityArea): void {
    this.editForm.patchValue({
      id: activityArea.id,
      name: activityArea.name,
    });
  }

  protected createFromForm(): IActivityArea {
    return {
      ...new ActivityArea(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
