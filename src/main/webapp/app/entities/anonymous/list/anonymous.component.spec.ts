import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AnonymousService } from '../service/anonymous.service';

import { AnonymousComponent } from './anonymous.component';

describe('Component Tests', () => {
  describe('Anonymous Management Component', () => {
    let comp: AnonymousComponent;
    let fixture: ComponentFixture<AnonymousComponent>;
    let service: AnonymousService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AnonymousComponent],
      })
        .overrideTemplate(AnonymousComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AnonymousComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AnonymousService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.anonymous?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
