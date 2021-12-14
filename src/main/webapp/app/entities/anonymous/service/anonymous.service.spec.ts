import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAnonymous, Anonymous } from '../anonymous.model';

import { AnonymousService } from './anonymous.service';

describe('Anonymous Service', () => {
  let service: AnonymousService;
  let httpMock: HttpTestingController;
  let elemDefault: IAnonymous;
  let expectedResult: IAnonymous | IAnonymous[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AnonymousService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      visitDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          visitDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Anonymous', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          visitDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          visitDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Anonymous()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Anonymous', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          visitDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          visitDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Anonymous', () => {
      const patchObject = Object.assign({}, new Anonymous());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          visitDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Anonymous', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          visitDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          visitDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Anonymous', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAnonymousToCollectionIfMissing', () => {
      it('should add a Anonymous to an empty array', () => {
        const anonymous: IAnonymous = { id: 123 };
        expectedResult = service.addAnonymousToCollectionIfMissing([], anonymous);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(anonymous);
      });

      it('should not add a Anonymous to an array that contains it', () => {
        const anonymous: IAnonymous = { id: 123 };
        const anonymousCollection: IAnonymous[] = [
          {
            ...anonymous,
          },
          { id: 456 },
        ];
        expectedResult = service.addAnonymousToCollectionIfMissing(anonymousCollection, anonymous);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Anonymous to an array that doesn't contain it", () => {
        const anonymous: IAnonymous = { id: 123 };
        const anonymousCollection: IAnonymous[] = [{ id: 456 }];
        expectedResult = service.addAnonymousToCollectionIfMissing(anonymousCollection, anonymous);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(anonymous);
      });

      it('should add only unique Anonymous to an array', () => {
        const anonymousArray: IAnonymous[] = [{ id: 123 }, { id: 456 }, { id: 47819 }];
        const anonymousCollection: IAnonymous[] = [{ id: 123 }];
        expectedResult = service.addAnonymousToCollectionIfMissing(anonymousCollection, ...anonymousArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const anonymous: IAnonymous = { id: 123 };
        const anonymous2: IAnonymous = { id: 456 };
        expectedResult = service.addAnonymousToCollectionIfMissing([], anonymous, anonymous2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(anonymous);
        expect(expectedResult).toContain(anonymous2);
      });

      it('should accept null and undefined values', () => {
        const anonymous: IAnonymous = { id: 123 };
        expectedResult = service.addAnonymousToCollectionIfMissing([], null, anonymous, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(anonymous);
      });

      it('should return initial array if no Anonymous is added', () => {
        const anonymousCollection: IAnonymous[] = [{ id: 123 }];
        expectedResult = service.addAnonymousToCollectionIfMissing(anonymousCollection, undefined, null);
        expect(expectedResult).toEqual(anonymousCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
