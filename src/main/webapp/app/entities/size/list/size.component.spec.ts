import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SizeService } from '../service/size.service';

import { SizeComponent } from './size.component';

describe('Size Management Component', () => {
  let comp: SizeComponent;
  let fixture: ComponentFixture<SizeComponent>;
  let service: SizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SizeComponent],
    })
      .overrideTemplate(SizeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SizeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SizeService);

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
    expect(comp.sizes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
