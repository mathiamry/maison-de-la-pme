jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PartnerService } from '../service/partner.service';
import { IPartner, Partner } from '../partner.model';
import { ISMEHouse } from 'app/entities/sme-house/sme-house.model';
import { SMEHouseService } from 'app/entities/sme-house/service/sme-house.service';

import { PartnerUpdateComponent } from './partner-update.component';

describe('Partner Management Update Component', () => {
  let comp: PartnerUpdateComponent;
  let fixture: ComponentFixture<PartnerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let partnerService: PartnerService;
  let sMEHouseService: SMEHouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PartnerUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(PartnerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PartnerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    partnerService = TestBed.inject(PartnerService);
    sMEHouseService = TestBed.inject(SMEHouseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SMEHouse query and add missing value', () => {
      const partner: IPartner = { id: 456 };
      const smeHouse: ISMEHouse = { id: 58554 };
      partner.smeHouse = smeHouse;

      const sMEHouseCollection: ISMEHouse[] = [{ id: 95034 }];
      jest.spyOn(sMEHouseService, 'query').mockReturnValue(of(new HttpResponse({ body: sMEHouseCollection })));
      const additionalSMEHouses = [smeHouse];
      const expectedCollection: ISMEHouse[] = [...additionalSMEHouses, ...sMEHouseCollection];
      jest.spyOn(sMEHouseService, 'addSMEHouseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ partner });
      comp.ngOnInit();

      expect(sMEHouseService.query).toHaveBeenCalled();
      expect(sMEHouseService.addSMEHouseToCollectionIfMissing).toHaveBeenCalledWith(sMEHouseCollection, ...additionalSMEHouses);
      expect(comp.sMEHousesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const partner: IPartner = { id: 456 };
      const smeHouse: ISMEHouse = { id: 29165 };
      partner.smeHouse = smeHouse;

      activatedRoute.data = of({ partner });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(partner));
      expect(comp.sMEHousesSharedCollection).toContain(smeHouse);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Partner>>();
      const partner = { id: 123 };
      jest.spyOn(partnerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partner });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: partner }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(partnerService.update).toHaveBeenCalledWith(partner);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Partner>>();
      const partner = new Partner();
      jest.spyOn(partnerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partner });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: partner }));
      saveSubject.complete();

      // THEN
      expect(partnerService.create).toHaveBeenCalledWith(partner);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Partner>>();
      const partner = { id: 123 };
      jest.spyOn(partnerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partner });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(partnerService.update).toHaveBeenCalledWith(partner);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSMEHouseById', () => {
      it('Should return tracked SMEHouse primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSMEHouseById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
