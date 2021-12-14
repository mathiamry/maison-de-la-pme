import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TenderDetailComponent } from './tender-detail.component';

describe('Tender Management Detail Component', () => {
  let comp: TenderDetailComponent;
  let fixture: ComponentFixture<TenderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TenderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ tender: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TenderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TenderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load tender on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.tender).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
