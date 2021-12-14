jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SizeService } from '../service/size.service';
import { ISize, Size } from '../size.model';

import { SizeUpdateComponent } from './size-update.component';

describe('Size Management Update Component', () => {
  let comp: SizeUpdateComponent;
  let fixture: ComponentFixture<SizeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sizeService: SizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SizeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(SizeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SizeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sizeService = TestBed.inject(SizeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const size: ISize = { id: 456 };

      activatedRoute.data = of({ size });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(size));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Size>>();
      const size = { id: 123 };
      jest.spyOn(sizeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ size });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: size }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(sizeService.update).toHaveBeenCalledWith(size);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Size>>();
      const size = new Size();
      jest.spyOn(sizeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ size });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: size }));
      saveSubject.complete();

      // THEN
      expect(sizeService.create).toHaveBeenCalledWith(size);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Size>>();
      const size = { id: 123 };
      jest.spyOn(sizeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ size });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sizeService.update).toHaveBeenCalledWith(size);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
