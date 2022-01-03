import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NeedService } from '../service/need.service';

import { NeedComponent } from './need.component';

describe('Need Management Component', () => {
  let comp: NeedComponent;
  let fixture: ComponentFixture<NeedComponent>;
  let service: NeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [NeedComponent],
    })
      .overrideTemplate(NeedComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NeedComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(NeedService);

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
    expect(comp.needs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
