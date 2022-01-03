import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PartnerRepresentativeDetailComponent } from './partner-representative-detail.component';

describe('PartnerRepresentative Management Detail Component', () => {
  let comp: PartnerRepresentativeDetailComponent;
  let fixture: ComponentFixture<PartnerRepresentativeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerRepresentativeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ partnerRepresentative: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PartnerRepresentativeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PartnerRepresentativeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load partnerRepresentative on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.partnerRepresentative).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
