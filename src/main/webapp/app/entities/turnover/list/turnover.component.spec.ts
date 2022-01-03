import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TurnoverService } from '../service/turnover.service';

import { TurnoverComponent } from './turnover.component';

describe('Turnover Management Component', () => {
  let comp: TurnoverComponent;
  let fixture: ComponentFixture<TurnoverComponent>;
  let service: TurnoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TurnoverComponent],
    })
      .overrideTemplate(TurnoverComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TurnoverComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TurnoverService);

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
    expect(comp.turnovers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
