import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ActivityAreaService } from '../service/activity-area.service';

import { ActivityAreaComponent } from './activity-area.component';

describe('ActivityArea Management Component', () => {
  let comp: ActivityAreaComponent;
  let fixture: ComponentFixture<ActivityAreaComponent>;
  let service: ActivityAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ActivityAreaComponent],
    })
      .overrideTemplate(ActivityAreaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivityAreaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ActivityAreaService);

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
    expect(comp.activityAreas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
