import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAdministrator, Administrator } from '../administrator.model';
import { AdministratorService } from '../service/administrator.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';

@Component({
  selector: 'jhi-administrator-update',
  templateUrl: './administrator-update.component.html',
})
export class AdministratorUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  peopleCollection: IPerson[] = [];

  editForm = this.fb.group({
    id: [],
    jobTitle: [],
    description: [],
    internalUser: [null, Validators.required],
    person: [null, Validators.required],
  });

  constructor(
    protected administratorService: AdministratorService,
    protected userService: UserService,
    protected personService: PersonService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ administrator }) => {
      this.updateForm(administrator);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const administrator = this.createFromForm();
    if (administrator.id !== undefined) {
      this.subscribeToSaveResponse(this.administratorService.update(administrator));
    } else {
      this.subscribeToSaveResponse(this.administratorService.create(administrator));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackPersonById(index: number, item: IPerson): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdministrator>>): void {
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

  protected updateForm(administrator: IAdministrator): void {
    this.editForm.patchValue({
      id: administrator.id,
      jobTitle: administrator.jobTitle,
      description: administrator.description,
      internalUser: administrator.internalUser,
      person: administrator.person,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, administrator.internalUser);
    this.peopleCollection = this.personService.addPersonToCollectionIfMissing(this.peopleCollection, administrator.person);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('internalUser')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.personService
      .query({ filter: 'administrator-is-null' })
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(map((people: IPerson[]) => this.personService.addPersonToCollectionIfMissing(people, this.editForm.get('person')!.value)))
      .subscribe((people: IPerson[]) => (this.peopleCollection = people));
  }

  protected createFromForm(): IAdministrator {
    return {
      ...new Administrator(),
      id: this.editForm.get(['id'])!.value,
      jobTitle: this.editForm.get(['jobTitle'])!.value,
      description: this.editForm.get(['description'])!.value,
      internalUser: this.editForm.get(['internalUser'])!.value,
      person: this.editForm.get(['person'])!.value,
    };
  }
}
