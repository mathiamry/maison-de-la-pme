import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAdvisor, Advisor } from '../advisor.model';
import { AdvisorService } from '../service/advisor.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { ISMEHouse } from 'app/entities/sme-house/sme-house.model';
import { SMEHouseService } from 'app/entities/sme-house/service/sme-house.service';

@Component({
  selector: 'jhi-advisor-update',
  templateUrl: './advisor-update.component.html',
})
export class AdvisorUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  peopleCollection: IPerson[] = [];
  sMEHousesSharedCollection: ISMEHouse[] = [];

  editForm = this.fb.group({
    id: [],
    jobTitle: [],
    description: [],
    internalUser: [null, Validators.required],
    person: [null, Validators.required],
    smeHouse: [null, Validators.required],
  });

  constructor(
    protected advisorService: AdvisorService,
    protected userService: UserService,
    protected personService: PersonService,
    protected sMEHouseService: SMEHouseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ advisor }) => {
      this.updateForm(advisor);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const advisor = this.createFromForm();
    if (advisor.id !== undefined) {
      this.subscribeToSaveResponse(this.advisorService.update(advisor));
    } else {
      this.subscribeToSaveResponse(this.advisorService.create(advisor));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackPersonById(index: number, item: IPerson): number {
    return item.id!;
  }

  trackSMEHouseById(index: number, item: ISMEHouse): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdvisor>>): void {
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

  protected updateForm(advisor: IAdvisor): void {
    this.editForm.patchValue({
      id: advisor.id,
      jobTitle: advisor.jobTitle,
      description: advisor.description,
      internalUser: advisor.internalUser,
      person: advisor.person,
      smeHouse: advisor.smeHouse,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, advisor.internalUser);
    this.peopleCollection = this.personService.addPersonToCollectionIfMissing(this.peopleCollection, advisor.person);
    this.sMEHousesSharedCollection = this.sMEHouseService.addSMEHouseToCollectionIfMissing(
      this.sMEHousesSharedCollection,
      advisor.smeHouse
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('internalUser')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.personService
      .query({ filter: 'advisor-is-null' })
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(map((people: IPerson[]) => this.personService.addPersonToCollectionIfMissing(people, this.editForm.get('person')!.value)))
      .subscribe((people: IPerson[]) => (this.peopleCollection = people));

    this.sMEHouseService
      .query()
      .pipe(map((res: HttpResponse<ISMEHouse[]>) => res.body ?? []))
      .pipe(
        map((sMEHouses: ISMEHouse[]) =>
          this.sMEHouseService.addSMEHouseToCollectionIfMissing(sMEHouses, this.editForm.get('smeHouse')!.value)
        )
      )
      .subscribe((sMEHouses: ISMEHouse[]) => (this.sMEHousesSharedCollection = sMEHouses));
  }

  protected createFromForm(): IAdvisor {
    return {
      ...new Advisor(),
      id: this.editForm.get(['id'])!.value,
      jobTitle: this.editForm.get(['jobTitle'])!.value,
      description: this.editForm.get(['description'])!.value,
      internalUser: this.editForm.get(['internalUser'])!.value,
      person: this.editForm.get(['person'])!.value,
      smeHouse: this.editForm.get(['smeHouse'])!.value,
    };
  }
}
