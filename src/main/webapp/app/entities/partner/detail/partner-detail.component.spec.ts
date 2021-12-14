import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PartnerDetailComponent } from './partner-detail.component';

describe('Partner Management Detail Component', () => {
  let comp: PartnerDetailComponent;
  let fixture: ComponentFixture<PartnerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ partner: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PartnerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PartnerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load partner on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.partner).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
