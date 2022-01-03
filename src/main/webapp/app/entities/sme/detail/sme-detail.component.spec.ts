import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SmeDetailComponent } from './sme-detail.component';

describe('Sme Management Detail Component', () => {
  let comp: SmeDetailComponent;
  let fixture: ComponentFixture<SmeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SmeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sme: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SmeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SmeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sme on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sme).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
