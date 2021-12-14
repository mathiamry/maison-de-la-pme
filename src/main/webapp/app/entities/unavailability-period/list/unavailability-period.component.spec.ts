import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UnavailabilityPeriodService } from '../service/unavailability-period.service';

import { UnavailabilityPeriodComponent } from './unavailability-period.component';

describe('UnavailabilityPeriod Management Component', () => {
  let comp: UnavailabilityPeriodComponent;
  let fixture: ComponentFixture<UnavailabilityPeriodComponent>;
  let service: UnavailabilityPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UnavailabilityPeriodComponent],
    })
      .overrideTemplate(UnavailabilityPeriodComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UnavailabilityPeriodComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UnavailabilityPeriodService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.unavailabilityPeriods?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
