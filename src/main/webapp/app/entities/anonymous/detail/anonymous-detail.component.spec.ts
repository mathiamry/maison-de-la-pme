import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AnonymousDetailComponent } from './anonymous-detail.component';

describe('Anonymous Management Detail Component', () => {
  let comp: AnonymousDetailComponent;
  let fixture: ComponentFixture<AnonymousDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnonymousDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ anonymous: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AnonymousDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AnonymousDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load anonymous on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.anonymous).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
