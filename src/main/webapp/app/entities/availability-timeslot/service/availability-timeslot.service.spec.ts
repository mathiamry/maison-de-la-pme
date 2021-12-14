import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Day } from 'app/entities/enumerations/day.model';
import { IAvailabilityTimeslot, AvailabilityTimeslot } from '../availability-timeslot.model';

import { AvailabilityTimeslotService } from './availability-timeslot.service';

describe('AvailabilityTimeslot Service', () => {
  let service: AvailabilityTimeslotService;
  let httpMock: HttpTestingController;
  let elemDefault: IAvailabilityTimeslot;
  let expectedResult: IAvailabilityTimeslot | IAvailabilityTimeslot[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AvailabilityTimeslotService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      startHour: 0,
      startMin: 0,
      endHour: 0,
      endMin: 0,
      day: Day.MONDAY,
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

    it('should create a AvailabilityTimeslot', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AvailabilityTimeslot()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AvailabilityTimeslot', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          startHour: 1,
          startMin: 1,
          endHour: 1,
          endMin: 1,
          day: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AvailabilityTimeslot', () => {
      const patchObject = Object.assign(
        {
          endMin: 1,
        },
        new AvailabilityTimeslot()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AvailabilityTimeslot', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          startHour: 1,
          startMin: 1,
          endHour: 1,
          endMin: 1,
          day: 'BBBBBB',
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

    it('should delete a AvailabilityTimeslot', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAvailabilityTimeslotToCollectionIfMissing', () => {
      it('should add a AvailabilityTimeslot to an empty array', () => {
        const availabilityTimeslot: IAvailabilityTimeslot = { id: 123 };
        expectedResult = service.addAvailabilityTimeslotToCollectionIfMissing([], availabilityTimeslot);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(availabilityTimeslot);
      });

      it('should not add a AvailabilityTimeslot to an array that contains it', () => {
        const availabilityTimeslot: IAvailabilityTimeslot = { id: 123 };
        const availabilityTimeslotCollection: IAvailabilityTimeslot[] = [
          {
            ...availabilityTimeslot,
          },
          { id: 456 },
        ];
        expectedResult = service.addAvailabilityTimeslotToCollectionIfMissing(availabilityTimeslotCollection, availabilityTimeslot);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AvailabilityTimeslot to an array that doesn't contain it", () => {
        const availabilityTimeslot: IAvailabilityTimeslot = { id: 123 };
        const availabilityTimeslotCollection: IAvailabilityTimeslot[] = [{ id: 456 }];
        expectedResult = service.addAvailabilityTimeslotToCollectionIfMissing(availabilityTimeslotCollection, availabilityTimeslot);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(availabilityTimeslot);
      });

      it('should add only unique AvailabilityTimeslot to an array', () => {
        const availabilityTimeslotArray: IAvailabilityTimeslot[] = [{ id: 123 }, { id: 456 }, { id: 16382 }];
        const availabilityTimeslotCollection: IAvailabilityTimeslot[] = [{ id: 123 }];
        expectedResult = service.addAvailabilityTimeslotToCollectionIfMissing(availabilityTimeslotCollection, ...availabilityTimeslotArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const availabilityTimeslot: IAvailabilityTimeslot = { id: 123 };
        const availabilityTimeslot2: IAvailabilityTimeslot = { id: 456 };
        expectedResult = service.addAvailabilityTimeslotToCollectionIfMissing([], availabilityTimeslot, availabilityTimeslot2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(availabilityTimeslot);
        expect(expectedResult).toContain(availabilityTimeslot2);
      });

      it('should accept null and undefined values', () => {
        const availabilityTimeslot: IAvailabilityTimeslot = { id: 123 };
        expectedResult = service.addAvailabilityTimeslotToCollectionIfMissing([], null, availabilityTimeslot, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(availabilityTimeslot);
      });

      it('should return initial array if no AvailabilityTimeslot is added', () => {
        const availabilityTimeslotCollection: IAvailabilityTimeslot[] = [{ id: 123 }];
        expectedResult = service.addAvailabilityTimeslotToCollectionIfMissing(availabilityTimeslotCollection, undefined, null);
        expect(expectedResult).toEqual(availabilityTimeslotCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
