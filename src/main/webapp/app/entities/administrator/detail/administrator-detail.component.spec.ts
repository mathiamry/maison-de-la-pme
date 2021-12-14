import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AdministratorDetailComponent } from './administrator-detail.component';

describe('Administrator Management Detail Component', () => {
  let comp: AdministratorDetailComponent;
  let fixture: ComponentFixture<AdministratorDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministratorDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ administrator: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AdministratorDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AdministratorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load administrator on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.administrator).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
