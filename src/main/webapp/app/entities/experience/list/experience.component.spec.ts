import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ExperienceService } from '../service/experience.service';

import { ExperienceComponent } from './experience.component';

describe('Experience Management Component', () => {
  let comp: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;
  let service: ExperienceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ExperienceComponent],
    })
      .overrideTemplate(ExperienceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExperienceService);

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
    expect(comp.experiences?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
