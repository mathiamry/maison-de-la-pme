import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AppointmentObjectService } from '../service/appointment-object.service';
import { IAppointmentObject, AppointmentObject } from '../appointment-object.model';

import { AppointmentObjectUpdateComponent } from './appointment-object-update.component';

describe('AppointmentObject Management Update Component', () => {
  let comp: AppointmentObjectUpdateComponent;
  let fixture: ComponentFixture<AppointmentObjectUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let appointmentObjectService: AppointmentObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AppointmentObjectUpdateComponent],
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
      .overrideTemplate(AppointmentObjectUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentObjectUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    appointmentObjectService = TestBed.inject(AppointmentObjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const appointmentObject: IAppointmentObject = { id: 456 };

      activatedRoute.data = of({ appointmentObject });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(appointmentObject));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AppointmentObject>>();
      const appointmentObject = { id: 123 };
      jest.spyOn(appointmentObjectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appointmentObject });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appointmentObject }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(appointmentObjectService.update).toHaveBeenCalledWith(appointmentObject);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AppointmentObject>>();
      const appointmentObject = new AppointmentObject();
      jest.spyOn(appointmentObjectService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appointmentObject });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appointmentObject }));
      saveSubject.complete();

      // THEN
      expect(appointmentObjectService.create).toHaveBeenCalledWith(appointmentObject);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AppointmentObject>>();
      const appointmentObject = { id: 123 };
      jest.spyOn(appointmentObjectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appointmentObject });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(appointmentObjectService.update).toHaveBeenCalledWith(appointmentObject);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
