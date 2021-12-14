import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITurnover, Turnover } from '../turnover.model';

import { TurnoverService } from './turnover.service';

describe('Turnover Service', () => {
  let service: TurnoverService;
  let httpMock: HttpTestingController;
  let elemDefault: ITurnover;
  let expectedResult: ITurnover | ITurnover[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TurnoverService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      min: 0,
      max: 0,
      description: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Turnover', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Turnover()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Turnover', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          min: 1,
          max: 1,
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Turnover', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
        },
        new Turnover()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Turnover', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          min: 1,
          max: 1,
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Turnover', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTurnoverToCollectionIfMissing', () => {
      it('should add a Turnover to an empty array', () => {
        const turnover: ITurnover = { id: 123 };
        expectedResult = service.addTurnoverToCollectionIfMissing([], turnover);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(turnover);
      });

      it('should not add a Turnover to an array that contains it', () => {
        const turnover: ITurnover = { id: 123 };
        const turnoverCollection: ITurnover[] = [
          {
            ...turnover,
          },
          { id: 456 },
        ];
        expectedResult = service.addTurnoverToCollectionIfMissing(turnoverCollection, turnover);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Turnover to an array that doesn't contain it", () => {
        const turnover: ITurnover = { id: 123 };
        const turnoverCollection: ITurnover[] = [{ id: 456 }];
        expectedResult = service.addTurnoverToCollectionIfMissing(turnoverCollection, turnover);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(turnover);
      });

      it('should add only unique Turnover to an array', () => {
        const turnoverArray: ITurnover[] = [{ id: 123 }, { id: 456 }, { id: 19679 }];
        const turnoverCollection: ITurnover[] = [{ id: 123 }];
        expectedResult = service.addTurnoverToCollectionIfMissing(turnoverCollection, ...turnoverArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const turnover: ITurnover = { id: 123 };
        const turnover2: ITurnover = { id: 456 };
        expectedResult = service.addTurnoverToCollectionIfMissing([], turnover, turnover2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(turnover);
        expect(expectedResult).toContain(turnover2);
      });

      it('should accept null and undefined values', () => {
        const turnover: ITurnover = { id: 123 };
        expectedResult = service.addTurnoverToCollectionIfMissing([], null, turnover, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(turnover);
      });

      it('should return initial array if no Turnover is added', () => {
        const turnoverCollection: ITurnover[] = [{ id: 123 }];
        expectedResult = service.addTurnoverToCollectionIfMissing(turnoverCollection, undefined, null);
        expect(expectedResult).toEqual(turnoverCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
