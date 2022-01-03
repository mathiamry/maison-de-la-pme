import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TenderService } from '../service/tender.service';

import { TenderComponent } from './tender.component';

describe('Tender Management Component', () => {
  let comp: TenderComponent;
  let fixture: ComponentFixture<TenderComponent>;
  let service: TenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TenderComponent],
    })
      .overrideTemplate(TenderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TenderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TenderService);

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
    expect(comp.tenders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
