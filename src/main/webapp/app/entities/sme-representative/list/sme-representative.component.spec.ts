import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SmeRepresentativeService } from '../service/sme-representative.service';

import { SmeRepresentativeComponent } from './sme-representative.component';

describe('SmeRepresentative Management Component', () => {
  let comp: SmeRepresentativeComponent;
  let fixture: ComponentFixture<SmeRepresentativeComponent>;
  let service: SmeRepresentativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SmeRepresentativeComponent],
    })
      .overrideTemplate(SmeRepresentativeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SmeRepresentativeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SmeRepresentativeService);

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
    expect(comp.smeRepresentatives?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
