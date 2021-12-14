jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AvailabilityTimeslotService } from '../service/availability-timeslot.service';
import { IAvailabilityTimeslot, AvailabilityTimeslot } from '../availability-timeslot.model';
import { IAdvisor } from 'app/entities/advisor/advisor.model';
import { AdvisorService } from 'app/entities/advisor/service/advisor.service';
import { IPartnerRepresentative } from 'app/entities/partner-representative/partner-representative.model';
import { PartnerRepresentativeService } from 'app/entities/partner-representative/service/partner-representative.service';

import { AvailabilityTimeslotUpdateComponent } from './availability-timeslot-update.component';

describe('AvailabilityTimeslot Management Update Component', () => {
  let comp: AvailabilityTimeslotUpdateComponent;
  let fixture: ComponentFixture<AvailabilityTimeslotUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let availabilityTimeslotService: AvailabilityTimeslotService;
  let advisorService: AdvisorService;
  let partnerRepresentativeService: PartnerRepresentativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AvailabilityTimeslotUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(AvailabilityTimeslotUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AvailabilityTimeslotUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    availabilityTimeslotService = TestBed.inject(AvailabilityTimeslotService);
    advisorService = TestBed.inject(AdvisorService);
    partnerRepresentativeService = TestBed.inject(PartnerRepresentativeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Advisor query and add missing value', () => {
      const availabilityTimeslot: IAvailabilityTimeslot = { id: 456 };
      const advisors: IAdvisor[] = [{ id: 17060 }];
      availabilityTimeslot.advisors = advisors;

      const advisorCollection: IAdvisor[] = [{ id: 58863 }];
      jest.spyOn(advisorService, 'query').mockReturnValue(of(new HttpResponse({ body: advisorCollection })));
      const additionalAdvisors = [...advisors];
      const expectedCollection: IAdvisor[] = [...additionalAdvisors, ...advisorCollection];
      jest.spyOn(advisorService, 'addAdvisorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ availabilityTimeslot });
      comp.ngOnInit();

      expect(advisorService.query).toHaveBeenCalled();
      expect(advisorService.addAdvisorToCollectionIfMissing).toHaveBeenCalledWith(advisorCollection, ...additionalAdvisors);
      expect(comp.advisorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PartnerRepresentative query and add missing value', () => {
      const availabilityTimeslot: IAvailabilityTimeslot = { id: 456 };
      const partnerRepresentatives: IPartnerRepresentative[] = [{ id: 54725 }];
      availabilityTimeslot.partnerRepresentatives = partnerRepresentatives;

      const partnerRepresentativeCollection: IPartnerRepresentative[] = [{ id: 38375 }];
      jest.spyOn(partnerRepresentativeService, 'query').mockReturnValue(of(new HttpResponse({ body: partnerRepresentativeCollection })));
      const additionalPartnerRepresentatives = [...partnerRepresentatives];
      const expectedCollection: IPartnerRepresentative[] = [...additionalPartnerRepresentatives, ...partnerRepresentativeCollection];
      jest.spyOn(partnerRepresentativeService, 'addPartnerRepresentativeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ availabilityTimeslot });
      comp.ngOnInit();

      expect(partnerRepresentativeService.query).toHaveBeenCalled();
      expect(partnerRepresentativeService.addPartnerRepresentativeToCollectionIfMissing).toHaveBeenCalledWith(
        partnerRepresentativeCollection,
        ...additionalPartnerRepresentatives
      );
      expect(comp.partnerRepresentativesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const availabilityTimeslot: IAvailabilityTimeslot = { id: 456 };
      const advisors: IAdvisor = { id: 48071 };
      availabilityTimeslot.advisors = [advisors];
      const partnerRepresentatives: IPartnerRepresentative = { id: 8770 };
      availabilityTimeslot.partnerRepresentatives = [partnerRepresentatives];

      activatedRoute.data = of({ availabilityTimeslot });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(availabilityTimeslot));
      expect(comp.advisorsSharedCollection).toContain(advisors);
      expect(comp.partnerRepresentativesSharedCollection).toContain(partnerRepresentatives);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AvailabilityTimeslot>>();
      const availabilityTimeslot = { id: 123 };
      jest.spyOn(availabilityTimeslotService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ availabilityTimeslot });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: availabilityTimeslot }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(availabilityTimeslotService.update).toHaveBeenCalledWith(availabilityTimeslot);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AvailabilityTimeslot>>();
      const availabilityTimeslot = new AvailabilityTimeslot();
      jest.spyOn(availabilityTimeslotService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ availabilityTimeslot });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: availabilityTimeslot }));
      saveSubject.complete();

      // THEN
      expect(availabilityTimeslotService.create).toHaveBeenCalledWith(availabilityTimeslot);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AvailabilityTimeslot>>();
      const availabilityTimeslot = { id: 123 };
      jest.spyOn(availabilityTimeslotService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ availabilityTimeslot });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(availabilityTimeslotService.update).toHaveBeenCalledWith(availabilityTimeslot);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
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

  describe('Getting selected relationships', () => {
    describe('getSelectedAdvisor', () => {
      it('Should return option if no Advisor is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedAdvisor(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Advisor for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedAdvisor(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Advisor is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedAdvisor(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });

    describe('getSelectedPartnerRepresentative', () => {
      it('Should return option if no PartnerRepresentative is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedPartnerRepresentative(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected PartnerRepresentative for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedPartnerRepresentative(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this PartnerRepresentative is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedPartnerRepresentative(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
