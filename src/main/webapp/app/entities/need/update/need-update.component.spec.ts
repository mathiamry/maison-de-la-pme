import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NeedService } from '../service/need.service';
import { INeed, Need } from '../need.model';

import { NeedUpdateComponent } from './need-update.component';

describe('Need Management Update Component', () => {
  let comp: NeedUpdateComponent;
  let fixture: ComponentFixture<NeedUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let needService: NeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NeedUpdateComponent],
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
      .overrideTemplate(NeedUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NeedUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    needService = TestBed.inject(NeedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const need: INeed = { id: 456 };

      activatedRoute.data = of({ need });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(need));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Need>>();
      const need = { id: 123 };
      jest.spyOn(needService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ need });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: need }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(needService.update).toHaveBeenCalledWith(need);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Need>>();
      const need = new Need();
      jest.spyOn(needService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ need });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: need }));
      saveSubject.complete();

      // THEN
      expect(needService.create).toHaveBeenCalledWith(need);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Need>>();
      const need = { id: 123 };
      jest.spyOn(needService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ need });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(needService.update).toHaveBeenCalledWith(need);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
