import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppointmentObjectDetailComponent } from './appointment-object-detail.component';

describe('AppointmentObject Management Detail Component', () => {
  let comp: AppointmentObjectDetailComponent;
  let fixture: ComponentFixture<AppointmentObjectDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentObjectDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ appointmentObject: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AppointmentObjectDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AppointmentObjectDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load appointmentObject on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.appointmentObject).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
