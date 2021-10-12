import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IExperience, Experience } from '../experience.model';
import { ExperienceService } from '../service/experience.service';

@Component({
  selector: 'jhi-experience-update',
  templateUrl: './experience-update.component.html',
})
export class ExperienceUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    min: [],
    max: [],
    description: [],
  });

  constructor(protected experienceService: ExperienceService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ experience }) => {
      this.updateForm(experience);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const experience = this.createFromForm();
    if (experience.id !== undefined) {
      this.subscribeToSaveResponse(this.experienceService.update(experience));
    } else {
      this.subscribeToSaveResponse(this.experienceService.create(experience));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExperience>>): void {
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

  protected updateForm(experience: IExperience): void {
    this.editForm.patchValue({
      id: experience.id,
      min: experience.min,
      max: experience.max,
      description: experience.description,
    });
  }

  protected createFromForm(): IExperience {
    return {
      ...new Experience(),
      id: this.editForm.get(['id'])!.value,
      min: this.editForm.get(['min'])!.value,
      max: this.editForm.get(['max'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
