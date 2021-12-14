jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AdvisorService } from '../service/advisor.service';
import { IAdvisor, Advisor } from '../advisor.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { ISMEHouse } from 'app/entities/sme-house/sme-house.model';
import { SMEHouseService } from 'app/entities/sme-house/service/sme-house.service';

import { AdvisorUpdateComponent } from './advisor-update.component';

describe('Advisor Management Update Component', () => {
  let comp: AdvisorUpdateComponent;
  let fixture: ComponentFixture<AdvisorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let advisorService: AdvisorService;
  let userService: UserService;
  let personService: PersonService;
  let sMEHouseService: SMEHouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdvisorUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(AdvisorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdvisorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    advisorService = TestBed.inject(AdvisorService);
    userService = TestBed.inject(UserService);
    personService = TestBed.inject(PersonService);
    sMEHouseService = TestBed.inject(SMEHouseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const advisor: IAdvisor = { id: 456 };
      const internalUser: IUser = { id: 25311 };
      advisor.internalUser = internalUser;

      const userCollection: IUser[] = [{ id: 966 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [internalUser];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ advisor });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call person query and add missing value', () => {
      const advisor: IAdvisor = { id: 456 };
      const person: IPerson = { id: 19830 };
      advisor.person = person;

      const personCollection: IPerson[] = [{ id: 85734 }];
      jest.spyOn(personService, 'query').mockReturnValue(of(new HttpResponse({ body: personCollection })));
      const expectedCollection: IPerson[] = [person, ...personCollection];
      jest.spyOn(personService, 'addPersonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ advisor });
      comp.ngOnInit();

      expect(personService.query).toHaveBeenCalled();
      expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(personCollection, person);
      expect(comp.peopleCollection).toEqual(expectedCollection);
    });

    it('Should call SMEHouse query and add missing value', () => {
      const advisor: IAdvisor = { id: 456 };
      const smeHouse: ISMEHouse = { id: 88215 };
      advisor.smeHouse = smeHouse;

      const sMEHouseCollection: ISMEHouse[] = [{ id: 44158 }];
      jest.spyOn(sMEHouseService, 'query').mockReturnValue(of(new HttpResponse({ body: sMEHouseCollection })));
      const additionalSMEHouses = [smeHouse];
      const expectedCollection: ISMEHouse[] = [...additionalSMEHouses, ...sMEHouseCollection];
      jest.spyOn(sMEHouseService, 'addSMEHouseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ advisor });
      comp.ngOnInit();

      expect(sMEHouseService.query).toHaveBeenCalled();
      expect(sMEHouseService.addSMEHouseToCollectionIfMissing).toHaveBeenCalledWith(sMEHouseCollection, ...additionalSMEHouses);
      expect(comp.sMEHousesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const advisor: IAdvisor = { id: 456 };
      const internalUser: IUser = { id: 83882 };
      advisor.internalUser = internalUser;
      const person: IPerson = { id: 52653 };
      advisor.person = person;
      const smeHouse: ISMEHouse = { id: 69179 };
      advisor.smeHouse = smeHouse;

      activatedRoute.data = of({ advisor });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(advisor));
      expect(comp.usersSharedCollection).toContain(internalUser);
      expect(comp.peopleCollection).toContain(person);
      expect(comp.sMEHousesSharedCollection).toContain(smeHouse);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Advisor>>();
      const advisor = { id: 123 };
      jest.spyOn(advisorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ advisor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: advisor }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(advisorService.update).toHaveBeenCalledWith(advisor);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Advisor>>();
      const advisor = new Advisor();
      jest.spyOn(advisorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ advisor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: advisor }));
      saveSubject.complete();

      // THEN
      expect(advisorService.create).toHaveBeenCalledWith(advisor);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Advisor>>();
      const advisor = { id: 123 };
      jest.spyOn(advisorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ advisor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(advisorService.update).toHaveBeenCalledWith(advisor);
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

    describe('trackSMEHouseById', () => {
      it('Should return tracked SMEHouse primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSMEHouseById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
