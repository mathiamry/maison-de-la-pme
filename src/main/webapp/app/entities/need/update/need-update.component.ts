import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { INeed, Need } from '../need.model';
import { NeedService } from '../service/need.service';

@Component({
  selector: 'jhi-need-update',
  templateUrl: './need-update.component.html',
})
export class NeedUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
  });

  constructor(protected needService: NeedService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ need }) => {
      this.updateForm(need);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const need = this.createFromForm();
    if (need.id !== undefined) {
      this.subscribeToSaveResponse(this.needService.update(need));
    } else {
      this.subscribeToSaveResponse(this.needService.create(need));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INeed>>): void {
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

  protected updateForm(need: INeed): void {
    this.editForm.patchValue({
      id: need.id,
      name: need.name,
    });
  }

  protected createFromForm(): INeed {
    return {
      ...new Need(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
