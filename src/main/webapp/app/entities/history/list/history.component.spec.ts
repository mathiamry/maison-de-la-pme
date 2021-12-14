import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HistoryService } from '../service/history.service';

import { HistoryComponent } from './history.component';

describe('History Management Component', () => {
  let comp: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let service: HistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HistoryComponent],
    })
      .overrideTemplate(HistoryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HistoryService);

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
    expect(comp.histories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
