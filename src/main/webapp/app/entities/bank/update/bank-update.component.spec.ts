import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BankService } from '../service/bank.service';
import { IBank, Bank } from '../bank.model';
import { ISme } from 'app/entities/sme/sme.model';
import { SmeService } from 'app/entities/sme/service/sme.service';

import { BankUpdateComponent } from './bank-update.component';

describe('Bank Management Update Component', () => {
  let comp: BankUpdateComponent;
  let fixture: ComponentFixture<BankUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bankService: BankService;
  let smeService: SmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BankUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BankUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BankUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bankService = TestBed.inject(BankService);
    smeService = TestBed.inject(SmeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Sme query and add missing value', () => {
      const bank: IBank = { id: 456 };
      const smes: ISme[] = [{ id: 11023 }];
      bank.smes = smes;

      const smeCollection: ISme[] = [{ id: 88026 }];
      jest.spyOn(smeService, 'query').mockReturnValue(of(new HttpResponse({ body: smeCollection })));
      const additionalSmes = [...smes];
      const expectedCollection: ISme[] = [...additionalSmes, ...smeCollection];
      jest.spyOn(smeService, 'addSmeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bank });
      comp.ngOnInit();

      expect(smeService.query).toHaveBeenCalled();
      expect(smeService.addSmeToCollectionIfMissing).toHaveBeenCalledWith(smeCollection, ...additionalSmes);
      expect(comp.smesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bank: IBank = { id: 456 };
      const smes: ISme = { id: 4990 };
      bank.smes = [smes];

      activatedRoute.data = of({ bank });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(bank));
      expect(comp.smesSharedCollection).toContain(smes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bank>>();
      const bank = { id: 123 };
      jest.spyOn(bankService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bank });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bank }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(bankService.update).toHaveBeenCalledWith(bank);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bank>>();
      const bank = new Bank();
      jest.spyOn(bankService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bank });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bank }));
      saveSubject.complete();

      // THEN
      expect(bankService.create).toHaveBeenCalledWith(bank);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Bank>>();
      const bank = { id: 123 };
      jest.spyOn(bankService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bank });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bankService.update).toHaveBeenCalledWith(bank);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSmeById', () => {
      it('Should return tracked Sme primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSmeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedSme', () => {
      it('Should return option if no Sme is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedSme(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Sme for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedSme(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Sme is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedSme(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
