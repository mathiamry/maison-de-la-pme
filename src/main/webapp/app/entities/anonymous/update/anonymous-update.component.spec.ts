jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AnonymousService } from '../service/anonymous.service';
import { IAnonymous, Anonymous } from '../anonymous.model';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

import { AnonymousUpdateComponent } from './anonymous-update.component';

describe('Anonymous Management Update Component', () => {
  let comp: AnonymousUpdateComponent;
  let fixture: ComponentFixture<AnonymousUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let anonymousService: AnonymousService;
  let personService: PersonService;
  let appointmentService: AppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AnonymousUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(AnonymousUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AnonymousUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    anonymousService = TestBed.inject(AnonymousService);
    personService = TestBed.inject(PersonService);
    appointmentService = TestBed.inject(AppointmentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call person query and add missing value', () => {
      const anonymous: IAnonymous = { id: 456 };
      const person: IPerson = { id: 95995 };
      anonymous.person = person;

      const personCollection: IPerson[] = [{ id: 17074 }];
      jest.spyOn(personService, 'query').mockReturnValue(of(new HttpResponse({ body: personCollection })));
      const expectedCollection: IPerson[] = [person, ...personCollection];
      jest.spyOn(personService, 'addPersonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ anonymous });
      comp.ngOnInit();

      expect(personService.query).toHaveBeenCalled();
      expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(personCollection, person);
      expect(comp.peopleCollection).toEqual(expectedCollection);
    });

    it('Should call Appointment query and add missing value', () => {
      const anonymous: IAnonymous = { id: 456 };
      const appointments: IAppointment = { id: 59268 };
      anonymous.appointments = appointments;

      const appointmentCollection: IAppointment[] = [{ id: 4993 }];
      jest.spyOn(appointmentService, 'query').mockReturnValue(of(new HttpResponse({ body: appointmentCollection })));
      const additionalAppointments = [appointments];
      const expectedCollection: IAppointment[] = [...additionalAppointments, ...appointmentCollection];
      jest.spyOn(appointmentService, 'addAppointmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ anonymous });
      comp.ngOnInit();

      expect(appointmentService.query).toHaveBeenCalled();
      expect(appointmentService.addAppointmentToCollectionIfMissing).toHaveBeenCalledWith(appointmentCollection, ...additionalAppointments);
      expect(comp.appointmentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const anonymous: IAnonymous = { id: 456 };
      const person: IPerson = { id: 63876 };
      anonymous.person = person;
      const appointments: IAppointment = { id: 21749 };
      anonymous.appointments = appointments;

      activatedRoute.data = of({ anonymous });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(anonymous));
      expect(comp.peopleCollection).toContain(person);
      expect(comp.appointmentsSharedCollection).toContain(appointments);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Anonymous>>();
      const anonymous = { id: 123 };
      jest.spyOn(anonymousService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ anonymous });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: anonymous }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(anonymousService.update).toHaveBeenCalledWith(anonymous);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Anonymous>>();
      const anonymous = new Anonymous();
      jest.spyOn(anonymousService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ anonymous });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: anonymous }));
      saveSubject.complete();

      // THEN
      expect(anonymousService.create).toHaveBeenCalledWith(anonymous);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Anonymous>>();
      const anonymous = { id: 123 };
      jest.spyOn(anonymousService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ anonymous });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(anonymousService.update).toHaveBeenCalledWith(anonymous);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPersonById', () => {
      it('Should return tracked Person primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPersonById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAppointmentById', () => {
      it('Should return tracked Appointment primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAppointmentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
