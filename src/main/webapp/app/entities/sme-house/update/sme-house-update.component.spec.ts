jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SMEHouseService } from '../service/sme-house.service';
import { ISMEHouse, SMEHouse } from '../sme-house.model';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';
import { IAdministrator } from 'app/entities/administrator/administrator.model';
import { AdministratorService } from 'app/entities/administrator/service/administrator.service';

import { SMEHouseUpdateComponent } from './sme-house-update.component';

describe('SMEHouse Management Update Component', () => {
  let comp: SMEHouseUpdateComponent;
  let fixture: ComponentFixture<SMEHouseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sMEHouseService: SMEHouseService;
  let countryService: CountryService;
  let administratorService: AdministratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SMEHouseUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(SMEHouseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SMEHouseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sMEHouseService = TestBed.inject(SMEHouseService);
    countryService = TestBed.inject(CountryService);
    administratorService = TestBed.inject(AdministratorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Country query and add missing value', () => {
      const sMEHouse: ISMEHouse = { id: 456 };
      const country: ICountry = { id: 7132 };
      sMEHouse.country = country;

      const countryCollection: ICountry[] = [{ id: 71804 }];
      jest.spyOn(countryService, 'query').mockReturnValue(of(new HttpResponse({ body: countryCollection })));
      const additionalCountries = [country];
      const expectedCollection: ICountry[] = [...additionalCountries, ...countryCollection];
      jest.spyOn(countryService, 'addCountryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sMEHouse });
      comp.ngOnInit();

      expect(countryService.query).toHaveBeenCalled();
      expect(countryService.addCountryToCollectionIfMissing).toHaveBeenCalledWith(countryCollection, ...additionalCountries);
      expect(comp.countriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Administrator query and add missing value', () => {
      const sMEHouse: ISMEHouse = { id: 456 };
      const administrator: IAdministrator = { id: 56312 };
      sMEHouse.administrator = administrator;

      const administratorCollection: IAdministrator[] = [{ id: 20258 }];
      jest.spyOn(administratorService, 'query').mockReturnValue(of(new HttpResponse({ body: administratorCollection })));
      const additionalAdministrators = [administrator];
      const expectedCollection: IAdministrator[] = [...additionalAdministrators, ...administratorCollection];
      jest.spyOn(administratorService, 'addAdministratorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sMEHouse });
      comp.ngOnInit();

      expect(administratorService.query).toHaveBeenCalled();
      expect(administratorService.addAdministratorToCollectionIfMissing).toHaveBeenCalledWith(
        administratorCollection,
        ...additionalAdministrators
      );
      expect(comp.administratorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sMEHouse: ISMEHouse = { id: 456 };
      const country: ICountry = { id: 67428 };
      sMEHouse.country = country;
      const administrator: IAdministrator = { id: 83972 };
      sMEHouse.administrator = administrator;

      activatedRoute.data = of({ sMEHouse });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sMEHouse));
      expect(comp.countriesSharedCollection).toContain(country);
      expect(comp.administratorsSharedCollection).toContain(administrator);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SMEHouse>>();
      const sMEHouse = { id: 123 };
      jest.spyOn(sMEHouseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sMEHouse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sMEHouse }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(sMEHouseService.update).toHaveBeenCalledWith(sMEHouse);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SMEHouse>>();
      const sMEHouse = new SMEHouse();
      jest.spyOn(sMEHouseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sMEHouse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sMEHouse }));
      saveSubject.complete();

      // THEN
      expect(sMEHouseService.create).toHaveBeenCalledWith(sMEHouse);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SMEHouse>>();
      const sMEHouse = { id: 123 };
      jest.spyOn(sMEHouseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sMEHouse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sMEHouseService.update).toHaveBeenCalledWith(sMEHouse);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCountryById', () => {
      it('Should return tracked Country primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCountryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAdministratorById', () => {
      it('Should return tracked Administrator primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAdministratorById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
