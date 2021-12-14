import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExperienceDetailComponent } from './experience-detail.component';

describe('Experience Management Detail Component', () => {
  let comp: ExperienceDetailComponent;
  let fixture: ComponentFixture<ExperienceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExperienceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ experience: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExperienceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExperienceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load experience on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.experience).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
