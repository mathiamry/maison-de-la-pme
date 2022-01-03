import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TurnoverDetailComponent } from './turnover-detail.component';

describe('Turnover Management Detail Component', () => {
  let comp: TurnoverDetailComponent;
  let fixture: ComponentFixture<TurnoverDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnoverDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ turnover: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TurnoverDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TurnoverDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load turnover on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.turnover).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
