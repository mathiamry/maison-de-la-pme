jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SmeRepresentativeService } from '../service/sme-representative.service';
import { ISmeRepresentative, SmeRepresentative } from '../sme-representative.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { ISme } from 'app/entities/sme/sme.model';
import { SmeService } from 'app/entities/sme/service/sme.service';

import { SmeRepresentativeUpdateComponent } from './sme-representative-update.component';

describe('SmeRepresentative Management Update Component', () => {
  let comp: SmeRepresentativeUpdateComponent;
  let fixture: ComponentFixture<SmeRepresentativeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let smeRepresentativeService: SmeRepresentativeService;
  let userService: UserService;
  let personService: PersonService;
  let smeService: SmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SmeRepresentativeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(SmeRepresentativeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SmeRepresentativeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    smeRepresentativeService = TestBed.inject(SmeRepresentativeService);
    userService = TestBed.inject(UserService);
    personService = TestBed.inject(PersonService);
    smeService = TestBed.inject(SmeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const smeRepresentative: ISmeRepresentative = { id: 456 };
      const internalUser: IUser = { id: 91373 };
      smeRepresentative.internalUser = internalUser;

      const userCollection: IUser[] = [{ id: 88594 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [internalUser];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ smeRepresentative });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call person query and add missing value', () => {
      const smeRepresentative: ISmeRepresentative = { id: 456 };
      const person: IPerson = { id: 63174 };
      smeRepresentative.person = person;

      const personCollection: IPerson[] = [{ id: 91886 }];
      jest.spyOn(personService, 'query').mockReturnValue(of(new HttpResponse({ body: personCollection })));
      const expectedCollection: IPerson[] = [person, ...personCollection];
      jest.spyOn(personService, 'addPersonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ smeRepresentative });
      comp.ngOnInit();

      expect(personService.query).toHaveBeenCalled();
      expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(personCollection, person);
      expect(comp.peopleCollection).toEqual(expectedCollection);
    });

    it('Should call Sme query and add missing value', () => {
      const smeRepresentative: ISmeRepresentative = { id: 456 };
      const sme: ISme = { id: 77691 };
      smeRepresentative.sme = sme;

      const smeCollection: ISme[] = [{ id: 83412 }];
      jest.spyOn(smeService, 'query').mockReturnValue(of(new HttpResponse({ body: smeCollection })));
      const additionalSmes = [sme];
      const expectedCollection: ISme[] = [...additionalSmes, ...smeCollection];
      jest.spyOn(smeService, 'addSmeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ smeRepresentative });
      comp.ngOnInit();

      expect(smeService.query).toHaveBeenCalled();
      expect(smeService.addSmeToCollectionIfMissing).toHaveBeenCalledWith(smeCollection, ...additionalSmes);
      expect(comp.smesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const smeRepresentative: ISmeRepresentative = { id: 456 };
      const internalUser: IUser = { id: 68813 };
      smeRepresentative.internalUser = internalUser;
      const person: IPerson = { id: 60396 };
      smeRepresentative.person = person;
      const sme: ISme = { id: 8557 };
      smeRepresentative.sme = sme;

      activatedRoute.data = of({ smeRepresentative });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(smeRepresentative));
      expect(comp.usersSharedCollection).toContain(internalUser);
      expect(comp.peopleCollection).toContain(person);
      expect(comp.smesSharedCollection).toContain(sme);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SmeRepresentative>>();
      const smeRepresentative = { id: 123 };
      jest.spyOn(smeRepresentativeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ smeRepresentative });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: smeRepresentative }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(smeRepresentativeService.update).toHaveBeenCalledWith(smeRepresentative);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SmeRepresentative>>();
      const smeRepresentative = new SmeRepresentative();
      jest.spyOn(smeRepresentativeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ smeRepresentative });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: smeRepresentative }));
      saveSubject.complete();

      // THEN
      expect(smeRepresentativeService.create).toHaveBeenCalledWith(smeRepresentative);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SmeRepresentative>>();
      const smeRepresentative = { id: 123 };
      jest.spyOn(smeRepresentativeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ smeRepresentative });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(smeRepresentativeService.update).toHaveBeenCalledWith(smeRepresentative);
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

    describe('trackSmeById', () => {
      it('Should return tracked Sme primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSmeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
