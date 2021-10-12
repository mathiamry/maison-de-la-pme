import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISmeRepresentative, SmeRepresentative } from '../sme-representative.model';
import { SmeRepresentativeService } from '../service/sme-representative.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { ISme } from 'app/entities/sme/sme.model';
import { SmeService } from 'app/entities/sme/service/sme.service';

@Component({
  selector: 'jhi-sme-representative-update',
  templateUrl: './sme-representative-update.component.html',
})
export class SmeRepresentativeUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  peopleCollection: IPerson[] = [];
  smesSharedCollection: ISme[] = [];

  editForm = this.fb.group({
    id: [],
    jobTitle: [],
    isAdmin: [],
    isManager: [],
    internalUser: [],
    person: [null, Validators.required],
    sme: [null, Validators.required],
  });

  constructor(
    protected smeRepresentativeService: SmeRepresentativeService,
    protected userService: UserService,
    protected personService: PersonService,
    protected smeService: SmeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ smeRepresentative }) => {
      this.updateForm(smeRepresentative);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const smeRepresentative = this.createFromForm();
    if (smeRepresentative.id !== undefined) {
      this.subscribeToSaveResponse(this.smeRepresentativeService.update(smeRepresentative));
    } else {
      this.subscribeToSaveResponse(this.smeRepresentativeService.create(smeRepresentative));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackPersonById(index: number, item: IPerson): number {
    return item.id!;
  }

  trackSmeById(index: number, item: ISme): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISmeRepresentative>>): void {
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

  protected updateForm(smeRepresentative: ISmeRepresentative): void {
    this.editForm.patchValue({
      id: smeRepresentative.id,
      jobTitle: smeRepresentative.jobTitle,
      isAdmin: smeRepresentative.isAdmin,
      isManager: smeRepresentative.isManager,
      internalUser: smeRepresentative.internalUser,
      person: smeRepresentative.person,
      sme: smeRepresentative.sme,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, smeRepresentative.internalUser);
    this.peopleCollection = this.personService.addPersonToCollectionIfMissing(this.peopleCollection, smeRepresentative.person);
    this.smesSharedCollection = this.smeService.addSmeToCollectionIfMissing(this.smesSharedCollection, smeRepresentative.sme);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('internalUser')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.personService
      .query({ filter: 'smerepresentative-is-null' })
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(map((people: IPerson[]) => this.personService.addPersonToCollectionIfMissing(people, this.editForm.get('person')!.value)))
      .subscribe((people: IPerson[]) => (this.peopleCollection = people));

    this.smeService
      .query()
      .pipe(map((res: HttpResponse<ISme[]>) => res.body ?? []))
      .pipe(map((smes: ISme[]) => this.smeService.addSmeToCollectionIfMissing(smes, this.editForm.get('sme')!.value)))
      .subscribe((smes: ISme[]) => (this.smesSharedCollection = smes));
  }

  protected createFromForm(): ISmeRepresentative {
    return {
      ...new SmeRepresentative(),
      id: this.editForm.get(['id'])!.value,
      jobTitle: this.editForm.get(['jobTitle'])!.value,
      isAdmin: this.editForm.get(['isAdmin'])!.value,
      isManager: this.editForm.get(['isManager'])!.value,
      internalUser: this.editForm.get(['internalUser'])!.value,
      person: this.editForm.get(['person'])!.value,
      sme: this.editForm.get(['sme'])!.value,
    };
  }
}
