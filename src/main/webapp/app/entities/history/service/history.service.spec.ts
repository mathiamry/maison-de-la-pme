import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IHistory, History } from '../history.model';

import { HistoryService } from './history.service';

describe('History Service', () => {
  let service: HistoryService;
  let httpMock: HttpTestingController;
  let elemDefault: IHistory;
  let expectedResult: IHistory | IHistory[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HistoryService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      origin: 'AAAAAAA',
      action: 'AAAAAAA',
      actionDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          actionDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a History', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          actionDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          actionDate: currentDate,
        },
        returnedFromService
      );

      service.create(new History()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a History', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          origin: 'BBBBBB',
          action: 'BBBBBB',
          actionDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          actionDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a History', () => {
      const patchObject = Object.assign(
        {
          action: 'BBBBBB',
          actionDate: currentDate.format(DATE_TIME_FORMAT),
        },
        new History()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          actionDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of History', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          origin: 'BBBBBB',
          action: 'BBBBBB',
          actionDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          actionDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a History', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addHistoryToCollectionIfMissing', () => {
      it('should add a History to an empty array', () => {
        const history: IHistory = { id: 123 };
        expectedResult = service.addHistoryToCollectionIfMissing([], history);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(history);
      });

      it('should not add a History to an array that contains it', () => {
        const history: IHistory = { id: 123 };
        const historyCollection: IHistory[] = [
          {
            ...history,
          },
          { id: 456 },
        ];
        expectedResult = service.addHistoryToCollectionIfMissing(historyCollection, history);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a History to an array that doesn't contain it", () => {
        const history: IHistory = { id: 123 };
        const historyCollection: IHistory[] = [{ id: 456 }];
        expectedResult = service.addHistoryToCollectionIfMissing(historyCollection, history);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(history);
      });

      it('should add only unique History to an array', () => {
        const historyArray: IHistory[] = [{ id: 123 }, { id: 456 }, { id: 31966 }];
        const historyCollection: IHistory[] = [{ id: 123 }];
        expectedResult = service.addHistoryToCollectionIfMissing(historyCollection, ...historyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const history: IHistory = { id: 123 };
        const history2: IHistory = { id: 456 };
        expectedResult = service.addHistoryToCollectionIfMissing([], history, history2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(history);
        expect(expectedResult).toContain(history2);
      });

      it('should accept null and undefined values', () => {
        const history: IHistory = { id: 123 };
        expectedResult = service.addHistoryToCollectionIfMissing([], null, history, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(history);
      });

      it('should return initial array if no History is added', () => {
        const historyCollection: IHistory[] = [{ id: 123 }];
        expectedResult = service.addHistoryToCollectionIfMissing(historyCollection, undefined, null);
        expect(expectedResult).toEqual(historyCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
