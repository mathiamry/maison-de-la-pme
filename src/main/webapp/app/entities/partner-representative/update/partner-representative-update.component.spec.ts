jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PartnerRepresentativeService } from '../service/partner-representative.service';
import { IPartnerRepresentative, PartnerRepresentative } from '../partner-representative.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { IPartner } from 'app/entities/partner/partner.model';
import { PartnerService } from 'app/entities/partner/service/partner.service';

import { PartnerRepresentativeUpdateComponent } from './partner-representative-update.component';

describe('PartnerRepresentative Management Update Component', () => {
  let comp: PartnerRepresentativeUpdateComponent;
  let fixture: ComponentFixture<PartnerRepresentativeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let partnerRepresentativeService: PartnerRepresentativeService;
  let userService: UserService;
  let personService: PersonService;
  let partnerService: PartnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PartnerRepresentativeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(PartnerRepresentativeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PartnerRepresentativeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    partnerRepresentativeService = TestBed.inject(PartnerRepresentativeService);
    userService = TestBed.inject(UserService);
    personService = TestBed.inject(PersonService);
    partnerService = TestBed.inject(PartnerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const partnerRepresentative: IPartnerRepresentative = { id: 456 };
      const internalUser: IUser = { id: 70939 };
      partnerRepresentative.internalUser = internalUser;

      const userCollection: IUser[] = [{ id: 46969 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [internalUser];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ partnerRepresentative });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call person query and add missing value', () => {
      const partnerRepresentative: IPartnerRepresentative = { id: 456 };
      const person: IPerson = { id: 39441 };
      partnerRepresentative.person = person;

      const personCollection: IPerson[] = [{ id: 54280 }];
      jest.spyOn(personService, 'query').mockReturnValue(of(new HttpResponse({ body: personCollection })));
      const expectedCollection: IPerson[] = [person, ...personCollection];
      jest.spyOn(personService, 'addPersonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ partnerRepresentative });
      comp.ngOnInit();

      expect(personService.query).toHaveBeenCalled();
      expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(personCollection, person);
      expect(comp.peopleCollection).toEqual(expectedCollection);
    });

    it('Should call Partner query and add missing value', () => {
      const partnerRepresentative: IPartnerRepresentative = { id: 456 };
      const partner: IPartner = { id: 39718 };
      partnerRepresentative.partner = partner;

      const partnerCollection: IPartner[] = [{ id: 14602 }];
      jest.spyOn(partnerService, 'query').mockReturnValue(of(new HttpResponse({ body: partnerCollection })));
      const additionalPartners = [partner];
      const expectedCollection: IPartner[] = [...additionalPartners, ...partnerCollection];
      jest.spyOn(partnerService, 'addPartnerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ partnerRepresentative });
      comp.ngOnInit();

      expect(partnerService.query).toHaveBeenCalled();
      expect(partnerService.addPartnerToCollectionIfMissing).toHaveBeenCalledWith(partnerCollection, ...additionalPartners);
      expect(comp.partnersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const partnerRepresentative: IPartnerRepresentative = { id: 456 };
      const internalUser: IUser = { id: 52672 };
      partnerRepresentative.internalUser = internalUser;
      const person: IPerson = { id: 7932 };
      partnerRepresentative.person = person;
      const partner: IPartner = { id: 41600 };
      partnerRepresentative.partner = partner;

      activatedRoute.data = of({ partnerRepresentative });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(partnerRepresentative));
      expect(comp.usersSharedCollection).toContain(internalUser);
      expect(comp.peopleCollection).toContain(person);
      expect(comp.partnersSharedCollection).toContain(partner);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PartnerRepresentative>>();
      const partnerRepresentative = { id: 123 };
      jest.spyOn(partnerRepresentativeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partnerRepresentative });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: partnerRepresentative }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(partnerRepresentativeService.update).toHaveBeenCalledWith(partnerRepresentative);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PartnerRepresentative>>();
      const partnerRepresentative = new PartnerRepresentative();
      jest.spyOn(partnerRepresentativeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partnerRepresentative });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: partnerRepresentative }));
      saveSubject.complete();

      // THEN
      expect(partnerRepresentativeService.create).toHaveBeenCalledWith(partnerRepresentative);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PartnerRepresentative>>();
      const partnerRepresentative = { id: 123 };
      jest.spyOn(partnerRepresentativeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partnerRepresentative });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(partnerRepresentativeService.update).toHaveBeenCalledWith(partnerRepresentative);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPersonById', () => {
      it('Should return tracked Person primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPersonById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPartnerById', () => {
      it('Should return tracked Partner primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPartnerById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
