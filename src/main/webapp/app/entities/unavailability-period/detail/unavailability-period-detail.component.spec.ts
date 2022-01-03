import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UnavailabilityPeriodDetailComponent } from './unavailability-period-detail.component';

describe('UnavailabilityPeriod Management Detail Component', () => {
  let comp: UnavailabilityPeriodDetailComponent;
  let fixture: ComponentFixture<UnavailabilityPeriodDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnavailabilityPeriodDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ unavailabilityPeriod: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UnavailabilityPeriodDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UnavailabilityPeriodDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load unavailabilityPeriod on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.unavailabilityPeriod).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
