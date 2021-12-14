import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AvailabilityTimeslotDetailComponent } from './availability-timeslot-detail.component';

describe('AvailabilityTimeslot Management Detail Component', () => {
  let comp: AvailabilityTimeslotDetailComponent;
  let fixture: ComponentFixture<AvailabilityTimeslotDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvailabilityTimeslotDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ availabilityTimeslot: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AvailabilityTimeslotDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AvailabilityTimeslotDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load availabilityTimeslot on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.availabilityTimeslot).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
