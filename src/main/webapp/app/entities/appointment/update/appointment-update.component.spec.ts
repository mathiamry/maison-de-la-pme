jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AppointmentService } from '../service/appointment.service';
import { IAppointment, Appointment } from '../appointment.model';
import { ISmeRepresentative } from 'app/entities/sme-representative/sme-representative.model';
import { SmeRepresentativeService } from 'app/entities/sme-representative/service/sme-representative.service';
import { IAdvisor } from 'app/entities/advisor/advisor.model';
import { AdvisorService } from 'app/entities/advisor/service/advisor.service';
import { IPartnerRepresentative } from 'app/entities/partner-representative/partner-representative.model';
import { PartnerRepresentativeService } from 'app/entities/partner-representative/service/partner-representative.service';

import { AppointmentUpdateComponent } from './appointment-update.component';

describe('Appointment Management Update Component', () => {
  let comp: AppointmentUpdateComponent;
  let fixture: ComponentFixture<AppointmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let appointmentService: AppointmentService;
  let smeRepresentativeService: SmeRepresentativeService;
  let advisorService: AdvisorService;
  let partnerRepresentativeService: PartnerRepresentativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AppointmentUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(AppointmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    appointmentService = TestBed.inject(AppointmentService);
    smeRepresentativeService = TestBed.inject(SmeRepresentativeService);
    advisorService = TestBed.inject(AdvisorService);
    partnerRepresentativeService = TestBed.inject(PartnerRepresentativeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SmeRepresentative query and add missing value', () => {
      const appointment: IAppointment = { id: 456 };
      const smeRepresentative: ISmeRepresentative = { id: 94871 };
      appointment.smeRepresentative = smeRepresentative;

      const smeRepresentativeCollection: ISmeRepresentative[] = [{ id: 77206 }];
      jest.spyOn(smeRepresentativeService, 'query').mockReturnValue(of(new HttpResponse({ body: smeRepresentativeCollection })));
      const additionalSmeRepresentatives = [smeRepresentative];
      const expectedCollection: ISmeRepresentative[] = [...additionalSmeRepresentatives, ...smeRepresentativeCollection];
      jest.spyOn(smeRepresentativeService, 'addSmeRepresentativeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ appointment });
      comp.ngOnInit();

      expect(smeRepresentativeService.query).toHaveBeenCalled();
      expect(smeRepresentativeService.addSmeRepresentativeToCollectionIfMissing).toHaveBeenCalledWith(
        smeRepresentativeCollection,
        ...additionalSmeRepresentatives
      );
      expect(comp.smeRepresentativesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Advisor query and add missing value', () => {
      const appointment: IAppointment = { id: 456 };
      const advisor: IAdvisor = { id: 74356 };
      appointment.advisor = advisor;

      const advisorCollection: IAdvisor[] = [{ id: 55594 }];
      jest.spyOn(advisorService, 'query').mockReturnValue(of(new HttpResponse({ body: advisorCollection })));
      const additionalAdvisors = [advisor];
      const expectedCollection: IAdvisor[] = [...additionalAdvisors, ...advisorCollection];
      jest.spyOn(advisorService, 'addAdvisorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ appointment });
      comp.ngOnInit();

      expect(advisorService.query).toHaveBeenCalled();
      expect(advisorService.addAdvisorToCollectionIfMissing).toHaveBeenCalledWith(advisorCollection, ...additionalAdvisors);
      expect(comp.advisorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PartnerRepresentative query and add missing value', () => {
      const appointment: IAppointment = { id: 456 };
      const partnerRepresentative: IPartnerRepresentative = { id: 3132 };
      appointment.partnerRepresentative = partnerRepresentative;

      const partnerRepresentativeCollection: IPartnerRepresentative[] = [{ id: 80543 }];
      jest.spyOn(partnerRepresentativeService, 'query').mockReturnValue(of(new HttpResponse({ body: partnerRepresentativeCollection })));
      const additionalPartnerRepresentatives = [partnerRepresentative];
      const expectedCollection: IPartnerRepresentative[] = [...additionalPartnerRepresentatives, ...partnerRepresentativeCollection];
      jest.spyOn(partnerRepresentativeService, 'addPartnerRepresentativeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ appointment });
      comp.ngOnInit();

      expect(partnerRepresentativeService.query).toHaveBeenCalled();
      expect(partnerRepresentativeService.addPartnerRepresentativeToCollectionIfMissing).toHaveBeenCalledWith(
        partnerRepresentativeCollection,
        ...additionalPartnerRepresentatives
      );
      expect(comp.partnerRepresentativesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const appointment: IAppointment = { id: 456 };
      const smeRepresentative: ISmeRepresentative = { id: 77036 };
      appointment.smeRepresentative = smeRepresentative;
      const advisor: IAdvisor = { id: 4599 };
      appointment.advisor = advisor;
      const partnerRepresentative: IPartnerRepresentative = { id: 10367 };
      appointment.partnerRepresentative = partnerRepresentative;

      activatedRoute.data = of({ appointment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(appointment));
      expect(comp.smeRepresentativesSharedCollection).toContain(smeRepresentative);
      expect(comp.advisorsSharedCollection).toContain(advisor);
      expect(comp.partnerRepresentativesSharedCollection).toContain(partnerRepresentative);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Appointment>>();
      const appointment = { id: 123 };
      jest.spyOn(appointmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appointment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appointment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(appointmentService.update).toHaveBeenCalledWith(appointment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Appointment>>();
      const appointment = new Appointment();
      jest.spyOn(appointmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appointment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appointment }));
      saveSubject.complete();

      // THEN
      expect(appointmentService.create).toHaveBeenCalledWith(appointment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Appointment>>();
      const appointment = { id: 123 };
      jest.spyOn(appointmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appointment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(appointmentService.update).toHaveBeenCalledWith(appointment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSmeRepresentativeById', () => {
      it('Should return tracked SmeRepresentative primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSmeRepresentativeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAdvisorById', () => {
      it('Should return tracked Advisor primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAdvisorById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPartnerRepresentativeById', () => {
      it('Should return tracked PartnerRepresentative primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPartnerRepresentativeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
