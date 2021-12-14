jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TurnoverService } from '../service/turnover.service';
import { ITurnover, Turnover } from '../turnover.model';

import { TurnoverUpdateComponent } from './turnover-update.component';

describe('Turnover Management Update Component', () => {
  let comp: TurnoverUpdateComponent;
  let fixture: ComponentFixture<TurnoverUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let turnoverService: TurnoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TurnoverUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(TurnoverUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TurnoverUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    turnoverService = TestBed.inject(TurnoverService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const turnover: ITurnover = { id: 456 };

      activatedRoute.data = of({ turnover });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(turnover));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Turnover>>();
      const turnover = { id: 123 };
      jest.spyOn(turnoverService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ turnover });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: turnover }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(turnoverService.update).toHaveBeenCalledWith(turnover);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Turnover>>();
      const turnover = new Turnover();
      jest.spyOn(turnoverService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ turnover });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: turnover }));
      saveSubject.complete();

      // THEN
      expect(turnoverService.create).toHaveBeenCalledWith(turnover);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Turnover>>();
      const turnover = { id: 123 };
      jest.spyOn(turnoverService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ turnover });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(turnoverService.update).toHaveBeenCalledWith(turnover);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
