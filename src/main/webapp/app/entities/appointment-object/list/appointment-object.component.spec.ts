import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AppointmentObjectService } from '../service/appointment-object.service';

import { AppointmentObjectComponent } from './appointment-object.component';

describe('AppointmentObject Management Component', () => {
  let comp: AppointmentObjectComponent;
  let fixture: ComponentFixture<AppointmentObjectComponent>;
  let service: AppointmentObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AppointmentObjectComponent],
    })
      .overrideTemplate(AppointmentObjectComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentObjectComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AppointmentObjectService);

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
    expect(comp.appointmentObjects?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
