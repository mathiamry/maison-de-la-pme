import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NeedDetailComponent } from './need-detail.component';

describe('Need Management Detail Component', () => {
  let comp: NeedDetailComponent;
  let fixture: ComponentFixture<NeedDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeedDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ need: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NeedDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NeedDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load need on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.need).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
