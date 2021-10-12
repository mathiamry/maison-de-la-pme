import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPartnerRepresentative, PartnerRepresentative } from '../partner-representative.model';
import { PartnerRepresentativeService } from '../service/partner-representative.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { IPartner } from 'app/entities/partner/partner.model';
import { PartnerService } from 'app/entities/partner/service/partner.service';

@Component({
  selector: 'jhi-partner-representative-update',
  templateUrl: './partner-representative-update.component.html',
})
export class PartnerRepresentativeUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  peopleCollection: IPerson[] = [];
  partnersSharedCollection: IPartner[] = [];

  editForm = this.fb.group({
    id: [],
    jobTitle: [],
    description: [],
    internalUser: [null, Validators.required],
    person: [null, Validators.required],
    partner: [null, Validators.required],
  });

  constructor(
    protected partnerRepresentativeService: PartnerRepresentativeService,
    protected userService: UserService,
    protected personService: PersonService,
    protected partnerService: PartnerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partnerRepresentative }) => {
      this.updateForm(partnerRepresentative);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const partnerRepresentative = this.createFromForm();
    if (partnerRepresentative.id !== undefined) {
      this.subscribeToSaveResponse(this.partnerRepresentativeService.update(partnerRepresentative));
    } else {
      this.subscribeToSaveResponse(this.partnerRepresentativeService.create(partnerRepresentative));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackPersonById(index: number, item: IPerson): number {
    return item.id!;
  }

  trackPartnerById(index: number, item: IPartner): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPartnerRepresentative>>): void {
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

  protected updateForm(partnerRepresentative: IPartnerRepresentative): void {
    this.editForm.patchValue({
      id: partnerRepresentative.id,
      jobTitle: partnerRepresentative.jobTitle,
      description: partnerRepresentative.description,
      internalUser: partnerRepresentative.internalUser,
      person: partnerRepresentative.person,
      partner: partnerRepresentative.partner,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
      this.usersSharedCollection,
      partnerRepresentative.internalUser
    );
    this.peopleCollection = this.personService.addPersonToCollectionIfMissing(this.peopleCollection, partnerRepresentative.person);
    this.partnersSharedCollection = this.partnerService.addPartnerToCollectionIfMissing(
      this.partnersSharedCollection,
      partnerRepresentative.partner
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('internalUser')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.personService
      .query({ filter: 'partnerrepresentative-is-null' })
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(map((people: IPerson[]) => this.personService.addPersonToCollectionIfMissing(people, this.editForm.get('person')!.value)))
      .subscribe((people: IPerson[]) => (this.peopleCollection = people));

    this.partnerService
      .query()
      .pipe(map((res: HttpResponse<IPartner[]>) => res.body ?? []))
      .pipe(
        map((partners: IPartner[]) => this.partnerService.addPartnerToCollectionIfMissing(partners, this.editForm.get('partner')!.value))
      )
      .subscribe((partners: IPartner[]) => (this.partnersSharedCollection = partners));
  }

  protected createFromForm(): IPartnerRepresentative {
    return {
      ...new PartnerRepresentative(),
      id: this.editForm.get(['id'])!.value,
      jobTitle: this.editForm.get(['jobTitle'])!.value,
      description: this.editForm.get(['description'])!.value,
      internalUser: this.editForm.get(['internalUser'])!.value,
      person: this.editForm.get(['person'])!.value,
      partner: this.editForm.get(['partner'])!.value,
    };
  }
}
