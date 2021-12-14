import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SMEHouseDetailComponent } from './sme-house-detail.component';

describe('SMEHouse Management Detail Component', () => {
  let comp: SMEHouseDetailComponent;
  let fixture: ComponentFixture<SMEHouseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SMEHouseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sMEHouse: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SMEHouseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SMEHouseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sMEHouse on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sMEHouse).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
