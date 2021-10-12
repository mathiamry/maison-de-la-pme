import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NewsService } from '../service/news.service';

import { NewsComponent } from './news.component';

describe('Component Tests', () => {
  describe('News Management Component', () => {
    let comp: NewsComponent;
    let fixture: ComponentFixture<NewsComponent>;
    let service: NewsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [NewsComponent],
      })
        .overrideTemplate(NewsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(NewsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(NewsService);

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
      expect(comp.news?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
