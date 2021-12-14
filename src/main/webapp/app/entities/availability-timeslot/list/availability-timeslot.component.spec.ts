import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AvailabilityTimeslotService } from '../service/availability-timeslot.service';

import { AvailabilityTimeslotComponent } from './availability-timeslot.component';

describe('AvailabilityTimeslot Management Component', () => {
  let comp: AvailabilityTimeslotComponent;
  let fixture: ComponentFixture<AvailabilityTimeslotComponent>;
  let service: AvailabilityTimeslotService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AvailabilityTimeslotComponent],
    })
      .overrideTemplate(AvailabilityTimeslotComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AvailabilityTimeslotComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AvailabilityTimeslotService);

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
    expect(comp.availabilityTimeslots?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
