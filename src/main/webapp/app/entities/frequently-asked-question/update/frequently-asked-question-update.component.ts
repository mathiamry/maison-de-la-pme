import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFrequentlyAskedQuestion, FrequentlyAskedQuestion } from '../frequently-asked-question.model';
import { FrequentlyAskedQuestionService } from '../service/frequently-asked-question.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-frequently-asked-question-update',
  templateUrl: './frequently-asked-question-update.component.html',
})
export class FrequentlyAskedQuestionUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    question: [null, [Validators.required]],
    answer: [null, [Validators.required]],
    order: [],
    isPublished: [],
    author: [null, Validators.required],
  });

  constructor(
    protected frequentlyAskedQuestionService: FrequentlyAskedQuestionService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ frequentlyAskedQuestion }) => {
      this.updateForm(frequentlyAskedQuestion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const frequentlyAskedQuestion = this.createFromForm();
    if (frequentlyAskedQuestion.id !== undefined) {
      this.subscribeToSaveResponse(this.frequentlyAskedQuestionService.update(frequentlyAskedQuestion));
    } else {
      this.subscribeToSaveResponse(this.frequentlyAskedQuestionService.create(frequentlyAskedQuestion));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFrequentlyAskedQuestion>>): void {
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

  protected updateForm(frequentlyAskedQuestion: IFrequentlyAskedQuestion): void {
    this.editForm.patchValue({
      id: frequentlyAskedQuestion.id,
      question: frequentlyAskedQuestion.question,
      answer: frequentlyAskedQuestion.answer,
      order: frequentlyAskedQuestion.order,
      isPublished: frequentlyAskedQuestion.isPublished,
      author: frequentlyAskedQuestion.author,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, frequentlyAskedQuestion.author);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('author')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IFrequentlyAskedQuestion {
    return {
      ...new FrequentlyAskedQuestion(),
      id: this.editForm.get(['id'])!.value,
      question: this.editForm.get(['question'])!.value,
      answer: this.editForm.get(['answer'])!.value,
      order: this.editForm.get(['order'])!.value,
      isPublished: this.editForm.get(['isPublished'])!.value,
      author: this.editForm.get(['author'])!.value,
    };
  }
}
