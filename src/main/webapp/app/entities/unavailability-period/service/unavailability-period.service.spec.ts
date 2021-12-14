import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUnavailabilityPeriod, UnavailabilityPeriod } from '../unavailability-period.model';

import { UnavailabilityPeriodService } from './unavailability-period.service';

describe('UnavailabilityPeriod Service', () => {
  let service: UnavailabilityPeriodService;
  let httpMock: HttpTestingController;
  let elemDefault: IUnavailabilityPeriod;
  let expectedResult: IUnavailabilityPeriod | IUnavailabilityPeriod[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UnavailabilityPeriodService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      startTime: currentDate,
      endTime: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          startTime: currentDate.format(DATE_TIME_FORMAT),
          endTime: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a UnavailabilityPeriod', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          startTime: currentDate.format(DATE_TIME_FORMAT),
          endTime: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startTime: currentDate,
          endTime: currentDate,
        },
        returnedFromService
      );

      service.create(new UnavailabilityPeriod()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UnavailabilityPeriod', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          startTime: currentDate.format(DATE_TIME_FORMAT),
          endTime: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startTime: currentDate,
          endTime: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UnavailabilityPeriod', () => {
      const patchObject = Object.assign(
        {
          startTime: currentDate.format(DATE_TIME_FORMAT),
          endTime: currentDate.format(DATE_TIME_FORMAT),
        },
        new UnavailabilityPeriod()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          startTime: currentDate,
          endTime: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UnavailabilityPeriod', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          startTime: currentDate.format(DATE_TIME_FORMAT),
          endTime: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startTime: currentDate,
          endTime: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a UnavailabilityPeriod', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addUnavailabilityPeriodToCollectionIfMissing', () => {
      it('should add a UnavailabilityPeriod to an empty array', () => {
        const unavailabilityPeriod: IUnavailabilityPeriod = { id: 123 };
        expectedResult = service.addUnavailabilityPeriodToCollectionIfMissing([], unavailabilityPeriod);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(unavailabilityPeriod);
      });

      it('should not add a UnavailabilityPeriod to an array that contains it', () => {
        const unavailabilityPeriod: IUnavailabilityPeriod = { id: 123 };
        const unavailabilityPeriodCollection: IUnavailabilityPeriod[] = [
          {
            ...unavailabilityPeriod,
          },
          { id: 456 },
        ];
        expectedResult = service.addUnavailabilityPeriodToCollectionIfMissing(unavailabilityPeriodCollection, unavailabilityPeriod);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UnavailabilityPeriod to an array that doesn't contain it", () => {
        const unavailabilityPeriod: IUnavailabilityPeriod = { id: 123 };
        const unavailabilityPeriodCollection: IUnavailabilityPeriod[] = [{ id: 456 }];
        expectedResult = service.addUnavailabilityPeriodToCollectionIfMissing(unavailabilityPeriodCollection, unavailabilityPeriod);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(unavailabilityPeriod);
      });

      it('should add only unique UnavailabilityPeriod to an array', () => {
        const unavailabilityPeriodArray: IUnavailabilityPeriod[] = [{ id: 123 }, { id: 456 }, { id: 69953 }];
        const unavailabilityPeriodCollection: IUnavailabilityPeriod[] = [{ id: 123 }];
        expectedResult = service.addUnavailabilityPeriodToCollectionIfMissing(unavailabilityPeriodCollection, ...unavailabilityPeriodArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const unavailabilityPeriod: IUnavailabilityPeriod = { id: 123 };
        const unavailabilityPeriod2: IUnavailabilityPeriod = { id: 456 };
        expectedResult = service.addUnavailabilityPeriodToCollectionIfMissing([], unavailabilityPeriod, unavailabilityPeriod2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(unavailabilityPeriod);
        expect(expectedResult).toContain(unavailabilityPeriod2);
      });

      it('should accept null and undefined values', () => {
        const unavailabilityPeriod: IUnavailabilityPeriod = { id: 123 };
        expectedResult = service.addUnavailabilityPeriodToCollectionIfMissing([], null, unavailabilityPeriod, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(unavailabilityPeriod);
      });

      it('should return initial array if no UnavailabilityPeriod is added', () => {
        const unavailabilityPeriodCollection: IUnavailabilityPeriod[] = [{ id: 123 }];
        expectedResult = service.addUnavailabilityPeriodToCollectionIfMissing(unavailabilityPeriodCollection, undefined, null);
        expect(expectedResult).toEqual(unavailabilityPeriodCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
