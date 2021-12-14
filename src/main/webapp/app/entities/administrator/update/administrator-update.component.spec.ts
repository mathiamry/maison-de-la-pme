jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AdministratorService } from '../service/administrator.service';
import { IAdministrator, Administrator } from '../administrator.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';

import { AdministratorUpdateComponent } from './administrator-update.component';

describe('Administrator Management Update Component', () => {
  let comp: AdministratorUpdateComponent;
  let fixture: ComponentFixture<AdministratorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let administratorService: AdministratorService;
  let userService: UserService;
  let personService: PersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdministratorUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(AdministratorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdministratorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    administratorService = TestBed.inject(AdministratorService);
    userService = TestBed.inject(UserService);
    personService = TestBed.inject(PersonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const administrator: IAdministrator = { id: 456 };
      const internalUser: IUser = { id: 53975 };
      administrator.internalUser = internalUser;

      const userCollection: IUser[] = [{ id: 40327 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [internalUser];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ administrator });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call person query and add missing value', () => {
      const administrator: IAdministrator = { id: 456 };
      const person: IPerson = { id: 43876 };
      administrator.person = person;

      const personCollection: IPerson[] = [{ id: 75483 }];
      jest.spyOn(personService, 'query').mockReturnValue(of(new HttpResponse({ body: personCollection })));
      const expectedCollection: IPerson[] = [person, ...personCollection];
      jest.spyOn(personService, 'addPersonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ administrator });
      comp.ngOnInit();

      expect(personService.query).toHaveBeenCalled();
      expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(personCollection, person);
      expect(comp.peopleCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const administrator: IAdministrator = { id: 456 };
      const internalUser: IUser = { id: 60219 };
      administrator.internalUser = internalUser;
      const person: IPerson = { id: 3147 };
      administrator.person = person;

      activatedRoute.data = of({ administrator });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(administrator));
      expect(comp.usersSharedCollection).toContain(internalUser);
      expect(comp.peopleCollection).toContain(person);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Administrator>>();
      const administrator = { id: 123 };
      jest.spyOn(administratorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ administrator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: administrator }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(administratorService.update).toHaveBeenCalledWith(administrator);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Administrator>>();
      const administrator = new Administrator();
      jest.spyOn(administratorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ administrator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: administrator }));
      saveSubject.complete();

      // THEN
      expect(administratorService.create).toHaveBeenCalledWith(administrator);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Administrator>>();
      const administrator = { id: 123 };
      jest.spyOn(administratorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ administrator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(administratorService.update).toHaveBeenCalledWith(administrator);
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
  });
});
