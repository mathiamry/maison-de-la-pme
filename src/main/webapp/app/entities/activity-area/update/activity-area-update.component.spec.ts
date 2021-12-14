jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ActivityAreaService } from '../service/activity-area.service';
import { IActivityArea, ActivityArea } from '../activity-area.model';

import { ActivityAreaUpdateComponent } from './activity-area-update.component';

describe('ActivityArea Management Update Component', () => {
  let comp: ActivityAreaUpdateComponent;
  let fixture: ComponentFixture<ActivityAreaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let activityAreaService: ActivityAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ActivityAreaUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ActivityAreaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivityAreaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    activityAreaService = TestBed.inject(ActivityAreaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const activityArea: IActivityArea = { id: 456 };

      activatedRoute.data = of({ activityArea });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(activityArea));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ActivityArea>>();
      const activityArea = { id: 123 };
      jest.spyOn(activityAreaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityArea });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activityArea }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(activityAreaService.update).toHaveBeenCalledWith(activityArea);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ActivityArea>>();
      const activityArea = new ActivityArea();
      jest.spyOn(activityAreaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityArea });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activityArea }));
      saveSubject.complete();

      // THEN
      expect(activityAreaService.create).toHaveBeenCalledWith(activityArea);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ActivityArea>>();
      const activityArea = { id: 123 };
      jest.spyOn(activityAreaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityArea });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(activityAreaService.update).toHaveBeenCalledWith(activityArea);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
