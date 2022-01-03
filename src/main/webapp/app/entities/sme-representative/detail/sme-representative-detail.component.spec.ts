import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SmeRepresentativeDetailComponent } from './sme-representative-detail.component';

describe('SmeRepresentative Management Detail Component', () => {
  let comp: SmeRepresentativeDetailComponent;
  let fixture: ComponentFixture<SmeRepresentativeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SmeRepresentativeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ smeRepresentative: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SmeRepresentativeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SmeRepresentativeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load smeRepresentative on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.smeRepresentative).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
