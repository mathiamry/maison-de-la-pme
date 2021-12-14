import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SMEHouseService } from '../service/sme-house.service';

import { SMEHouseComponent } from './sme-house.component';

describe('SMEHouse Management Component', () => {
  let comp: SMEHouseComponent;
  let fixture: ComponentFixture<SMEHouseComponent>;
  let service: SMEHouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SMEHouseComponent],
    })
      .overrideTemplate(SMEHouseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SMEHouseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SMEHouseService);

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
    expect(comp.sMEHouses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
