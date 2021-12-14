import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SizeDetailComponent } from './size-detail.component';

describe('Size Management Detail Component', () => {
  let comp: SizeDetailComponent;
  let fixture: ComponentFixture<SizeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SizeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ size: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SizeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SizeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load size on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.size).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
