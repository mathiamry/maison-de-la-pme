import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAppointmentObject, AppointmentObject } from '../appointment-object.model';

import { AppointmentObjectService } from './appointment-object.service';

describe('AppointmentObject Service', () => {
  let service: AppointmentObjectService;
  let httpMock: HttpTestingController;
  let elemDefault: IAppointmentObject;
  let expectedResult: IAppointmentObject | IAppointmentObject[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AppointmentObjectService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      object: 'AAAAAAA',
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

    it('should create a AppointmentObject', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AppointmentObject()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AppointmentObject', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          object: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AppointmentObject', () => {
      const patchObject = Object.assign(
        {
          object: 'BBBBBB',
        },
        new AppointmentObject()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AppointmentObject', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          object: 'BBBBBB',
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

    it('should delete a AppointmentObject', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAppointmentObjectToCollectionIfMissing', () => {
      it('should add a AppointmentObject to an empty array', () => {
        const appointmentObject: IAppointmentObject = { id: 123 };
        expectedResult = service.addAppointmentObjectToCollectionIfMissing([], appointmentObject);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(appointmentObject);
      });

      it('should not add a AppointmentObject to an array that contains it', () => {
        const appointmentObject: IAppointmentObject = { id: 123 };
        const appointmentObjectCollection: IAppointmentObject[] = [
          {
            ...appointmentObject,
          },
          { id: 456 },
        ];
        expectedResult = service.addAppointmentObjectToCollectionIfMissing(appointmentObjectCollection, appointmentObject);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AppointmentObject to an array that doesn't contain it", () => {
        const appointmentObject: IAppointmentObject = { id: 123 };
        const appointmentObjectCollection: IAppointmentObject[] = [{ id: 456 }];
        expectedResult = service.addAppointmentObjectToCollectionIfMissing(appointmentObjectCollection, appointmentObject);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(appointmentObject);
      });

      it('should add only unique AppointmentObject to an array', () => {
        const appointmentObjectArray: IAppointmentObject[] = [{ id: 123 }, { id: 456 }, { id: 17990 }];
        const appointmentObjectCollection: IAppointmentObject[] = [{ id: 123 }];
        expectedResult = service.addAppointmentObjectToCollectionIfMissing(appointmentObjectCollection, ...appointmentObjectArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const appointmentObject: IAppointmentObject = { id: 123 };
        const appointmentObject2: IAppointmentObject = { id: 456 };
        expectedResult = service.addAppointmentObjectToCollectionIfMissing([], appointmentObject, appointmentObject2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(appointmentObject);
        expect(expectedResult).toContain(appointmentObject2);
      });

      it('should accept null and undefined values', () => {
        const appointmentObject: IAppointmentObject = { id: 123 };
        expectedResult = service.addAppointmentObjectToCollectionIfMissing([], null, appointmentObject, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(appointmentObject);
      });

      it('should return initial array if no AppointmentObject is added', () => {
        const appointmentObjectCollection: IAppointmentObject[] = [{ id: 123 }];
        expectedResult = service.addAppointmentObjectToCollectionIfMissing(appointmentObjectCollection, undefined, null);
        expect(expectedResult).toEqual(appointmentObjectCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
