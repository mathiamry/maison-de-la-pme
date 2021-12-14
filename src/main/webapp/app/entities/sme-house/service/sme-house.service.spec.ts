import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISMEHouse, SMEHouse } from '../sme-house.model';

import { SMEHouseService } from './sme-house.service';

describe('SMEHouse Service', () => {
  let service: SMEHouseService;
  let httpMock: HttpTestingController;
  let elemDefault: ISMEHouse;
  let expectedResult: ISMEHouse | ISMEHouse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SMEHouseService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
      address: 'AAAAAAA',
      email: 'AAAAAAA',
      phone: 'AAAAAAA',
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

    it('should create a SMEHouse', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SMEHouse()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SMEHouse', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          address: 'BBBBBB',
          email: 'BBBBBB',
          phone: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SMEHouse', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
          email: 'BBBBBB',
          phone: 'BBBBBB',
        },
        new SMEHouse()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SMEHouse', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          address: 'BBBBBB',
          email: 'BBBBBB',
          phone: 'BBBBBB',
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

    it('should delete a SMEHouse', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSMEHouseToCollectionIfMissing', () => {
      it('should add a SMEHouse to an empty array', () => {
        const sMEHouse: ISMEHouse = { id: 123 };
        expectedResult = service.addSMEHouseToCollectionIfMissing([], sMEHouse);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sMEHouse);
      });

      it('should not add a SMEHouse to an array that contains it', () => {
        const sMEHouse: ISMEHouse = { id: 123 };
        const sMEHouseCollection: ISMEHouse[] = [
          {
            ...sMEHouse,
          },
          { id: 456 },
        ];
        expectedResult = service.addSMEHouseToCollectionIfMissing(sMEHouseCollection, sMEHouse);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SMEHouse to an array that doesn't contain it", () => {
        const sMEHouse: ISMEHouse = { id: 123 };
        const sMEHouseCollection: ISMEHouse[] = [{ id: 456 }];
        expectedResult = service.addSMEHouseToCollectionIfMissing(sMEHouseCollection, sMEHouse);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sMEHouse);
      });

      it('should add only unique SMEHouse to an array', () => {
        const sMEHouseArray: ISMEHouse[] = [{ id: 123 }, { id: 456 }, { id: 48047 }];
        const sMEHouseCollection: ISMEHouse[] = [{ id: 123 }];
        expectedResult = service.addSMEHouseToCollectionIfMissing(sMEHouseCollection, ...sMEHouseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sMEHouse: ISMEHouse = { id: 123 };
        const sMEHouse2: ISMEHouse = { id: 456 };
        expectedResult = service.addSMEHouseToCollectionIfMissing([], sMEHouse, sMEHouse2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sMEHouse);
        expect(expectedResult).toContain(sMEHouse2);
      });

      it('should accept null and undefined values', () => {
        const sMEHouse: ISMEHouse = { id: 123 };
        expectedResult = service.addSMEHouseToCollectionIfMissing([], null, sMEHouse, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sMEHouse);
      });

      it('should return initial array if no SMEHouse is added', () => {
        const sMEHouseCollection: ISMEHouse[] = [{ id: 123 }];
        expectedResult = service.addSMEHouseToCollectionIfMissing(sMEHouseCollection, undefined, null);
        expect(expectedResult).toEqual(sMEHouseCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
