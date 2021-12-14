import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PartnerRepresentativeService } from '../service/partner-representative.service';

import { PartnerRepresentativeComponent } from './partner-representative.component';

describe('PartnerRepresentative Management Component', () => {
  let comp: PartnerRepresentativeComponent;
  let fixture: ComponentFixture<PartnerRepresentativeComponent>;
  let service: PartnerRepresentativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PartnerRepresentativeComponent],
    })
      .overrideTemplate(PartnerRepresentativeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PartnerRepresentativeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PartnerRepresentativeService);

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
    expect(comp.partnerRepresentatives?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
