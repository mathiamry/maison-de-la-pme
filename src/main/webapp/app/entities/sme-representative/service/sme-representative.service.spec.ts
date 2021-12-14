import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISmeRepresentative, SmeRepresentative } from '../sme-representative.model';

import { SmeRepresentativeService } from './sme-representative.service';

describe('SmeRepresentative Service', () => {
  let service: SmeRepresentativeService;
  let httpMock: HttpTestingController;
  let elemDefault: ISmeRepresentative;
  let expectedResult: ISmeRepresentative | ISmeRepresentative[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SmeRepresentativeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      jobTitle: 'AAAAAAA',
      isAdmin: false,
      isManager: false,
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

    it('should create a SmeRepresentative', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SmeRepresentative()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SmeRepresentative', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          jobTitle: 'BBBBBB',
          isAdmin: true,
          isManager: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SmeRepresentative', () => {
      const patchObject = Object.assign(
        {
          isAdmin: true,
          isManager: true,
        },
        new SmeRepresentative()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SmeRepresentative', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          jobTitle: 'BBBBBB',
          isAdmin: true,
          isManager: true,
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

    it('should delete a SmeRepresentative', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSmeRepresentativeToCollectionIfMissing', () => {
      it('should add a SmeRepresentative to an empty array', () => {
        const smeRepresentative: ISmeRepresentative = { id: 123 };
        expectedResult = service.addSmeRepresentativeToCollectionIfMissing([], smeRepresentative);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(smeRepresentative);
      });

      it('should not add a SmeRepresentative to an array that contains it', () => {
        const smeRepresentative: ISmeRepresentative = { id: 123 };
        const smeRepresentativeCollection: ISmeRepresentative[] = [
          {
            ...smeRepresentative,
          },
          { id: 456 },
        ];
        expectedResult = service.addSmeRepresentativeToCollectionIfMissing(smeRepresentativeCollection, smeRepresentative);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SmeRepresentative to an array that doesn't contain it", () => {
        const smeRepresentative: ISmeRepresentative = { id: 123 };
        const smeRepresentativeCollection: ISmeRepresentative[] = [{ id: 456 }];
        expectedResult = service.addSmeRepresentativeToCollectionIfMissing(smeRepresentativeCollection, smeRepresentative);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(smeRepresentative);
      });

      it('should add only unique SmeRepresentative to an array', () => {
        const smeRepresentativeArray: ISmeRepresentative[] = [{ id: 123 }, { id: 456 }, { id: 59230 }];
        const smeRepresentativeCollection: ISmeRepresentative[] = [{ id: 123 }];
        expectedResult = service.addSmeRepresentativeToCollectionIfMissing(smeRepresentativeCollection, ...smeRepresentativeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const smeRepresentative: ISmeRepresentative = { id: 123 };
        const smeRepresentative2: ISmeRepresentative = { id: 456 };
        expectedResult = service.addSmeRepresentativeToCollectionIfMissing([], smeRepresentative, smeRepresentative2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(smeRepresentative);
        expect(expectedResult).toContain(smeRepresentative2);
      });

      it('should accept null and undefined values', () => {
        const smeRepresentative: ISmeRepresentative = { id: 123 };
        expectedResult = service.addSmeRepresentativeToCollectionIfMissing([], null, smeRepresentative, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(smeRepresentative);
      });

      it('should return initial array if no SmeRepresentative is added', () => {
        const smeRepresentativeCollection: ISmeRepresentative[] = [{ id: 123 }];
        expectedResult = service.addSmeRepresentativeToCollectionIfMissing(smeRepresentativeCollection, undefined, null);
        expect(expectedResult).toEqual(smeRepresentativeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
