import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INews, News } from '../news.model';

import { NewsService } from './news.service';

describe('News Service', () => {
  let service: NewsService;
  let httpMock: HttpTestingController;
  let elemDefault: INews;
  let expectedResult: INews | INews[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NewsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      description: 'AAAAAAA',
      createdAt: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          createdAt: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a News', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          createdAt: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdAt: currentDate,
        },
        returnedFromService
      );

      service.create(new News()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a News', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
          createdAt: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdAt: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a News', () => {
      const patchObject = Object.assign(
        {
          title: 'BBBBBB',
          createdAt: currentDate.format(DATE_TIME_FORMAT),
        },
        new News()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          createdAt: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of News', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
          createdAt: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdAt: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a News', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNewsToCollectionIfMissing', () => {
      it('should add a News to an empty array', () => {
        const news: INews = { id: 123 };
        expectedResult = service.addNewsToCollectionIfMissing([], news);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(news);
      });

      it('should not add a News to an array that contains it', () => {
        const news: INews = { id: 123 };
        const newsCollection: INews[] = [
          {
            ...news,
          },
          { id: 456 },
        ];
        expectedResult = service.addNewsToCollectionIfMissing(newsCollection, news);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a News to an array that doesn't contain it", () => {
        const news: INews = { id: 123 };
        const newsCollection: INews[] = [{ id: 456 }];
        expectedResult = service.addNewsToCollectionIfMissing(newsCollection, news);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(news);
      });

      it('should add only unique News to an array', () => {
        const newsArray: INews[] = [{ id: 123 }, { id: 456 }, { id: 14056 }];
        const newsCollection: INews[] = [{ id: 123 }];
        expectedResult = service.addNewsToCollectionIfMissing(newsCollection, ...newsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const news: INews = { id: 123 };
        const news2: INews = { id: 456 };
        expectedResult = service.addNewsToCollectionIfMissing([], news, news2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(news);
        expect(expectedResult).toContain(news2);
      });

      it('should accept null and undefined values', () => {
        const news: INews = { id: 123 };
        expectedResult = service.addNewsToCollectionIfMissing([], null, news, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(news);
      });

      it('should return initial array if no News is added', () => {
        const newsCollection: INews[] = [{ id: 123 }];
        expectedResult = service.addNewsToCollectionIfMissing(newsCollection, undefined, null);
        expect(expectedResult).toEqual(newsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
