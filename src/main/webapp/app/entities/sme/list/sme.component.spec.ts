import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SmeService } from '../service/sme.service';

import { SmeComponent } from './sme.component';

describe('Sme Management Component', () => {
  let comp: SmeComponent;
  let fixture: ComponentFixture<SmeComponent>;
  let service: SmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SmeComponent],
    })
      .overrideTemplate(SmeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SmeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SmeService);

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
    expect(comp.smes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
