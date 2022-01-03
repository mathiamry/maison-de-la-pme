import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FrequentlyAskedQuestionDetailComponent } from './frequently-asked-question-detail.component';

describe('FrequentlyAskedQuestion Management Detail Component', () => {
  let comp: FrequentlyAskedQuestionDetailComponent;
  let fixture: ComponentFixture<FrequentlyAskedQuestionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrequentlyAskedQuestionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ frequentlyAskedQuestion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FrequentlyAskedQuestionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FrequentlyAskedQuestionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load frequentlyAskedQuestion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.frequentlyAskedQuestion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
