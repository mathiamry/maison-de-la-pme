import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActivityAreaDetailComponent } from './activity-area-detail.component';

describe('ActivityArea Management Detail Component', () => {
  let comp: ActivityAreaDetailComponent;
  let fixture: ComponentFixture<ActivityAreaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityAreaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ activityArea: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ActivityAreaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ActivityAreaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load activityArea on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.activityArea).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
