import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISme, Sme } from '../sme.model';

import { SmeService } from './sme.service';

describe('Sme Service', () => {
  let service: SmeService;
  let httpMock: HttpTestingController;
  let elemDefault: ISme;
  let expectedResult: ISme | ISme[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SmeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      email: 'AAAAAAA',
      phone: 'AAAAAAA',
      phone2: 'AAAAAAA',
      logo: 'AAAAAAA',
      address: 'AAAAAAA',
      latitude: 'AAAAAAA',
      longitude: 'AAAAAAA',
      webSite: 'AAAAAAA',
      smeImmatriculationNumber: 'AAAAAAA',
      isClient: false,
      isAuthorized: false,
      termsOfUse: 'AAAAAAA',
      isValid: false,
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

    it('should create a Sme', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Sme()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Sme', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          email: 'BBBBBB',
          phone: 'BBBBBB',
          phone2: 'BBBBBB',
          logo: 'BBBBBB',
          address: 'BBBBBB',
          latitude: 'BBBBBB',
          longitude: 'BBBBBB',
          webSite: 'BBBBBB',
          smeImmatriculationNumber: 'BBBBBB',
          isClient: true,
          isAuthorized: true,
          termsOfUse: 'BBBBBB',
          isValid: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Sme', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          address: 'BBBBBB',
          latitude: 'BBBBBB',
          longitude: 'BBBBBB',
        },
        new Sme()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Sme', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          email: 'BBBBBB',
          phone: 'BBBBBB',
          phone2: 'BBBBBB',
          logo: 'BBBBBB',
          address: 'BBBBBB',
          latitude: 'BBBBBB',
          longitude: 'BBBBBB',
          webSite: 'BBBBBB',
          smeImmatriculationNumber: 'BBBBBB',
          isClient: true,
          isAuthorized: true,
          termsOfUse: 'BBBBBB',
          isValid: true,
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

    it('should delete a Sme', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSmeToCollectionIfMissing', () => {
      it('should add a Sme to an empty array', () => {
        const sme: ISme = { id: 123 };
        expectedResult = service.addSmeToCollectionIfMissing([], sme);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sme);
      });

      it('should not add a Sme to an array that contains it', () => {
        const sme: ISme = { id: 123 };
        const smeCollection: ISme[] = [
          {
            ...sme,
          },
          { id: 456 },
        ];
        expectedResult = service.addSmeToCollectionIfMissing(smeCollection, sme);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Sme to an array that doesn't contain it", () => {
        const sme: ISme = { id: 123 };
        const smeCollection: ISme[] = [{ id: 456 }];
        expectedResult = service.addSmeToCollectionIfMissing(smeCollection, sme);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sme);
      });

      it('should add only unique Sme to an array', () => {
        const smeArray: ISme[] = [{ id: 123 }, { id: 456 }, { id: 24141 }];
        const smeCollection: ISme[] = [{ id: 123 }];
        expectedResult = service.addSmeToCollectionIfMissing(smeCollection, ...smeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sme: ISme = { id: 123 };
        const sme2: ISme = { id: 456 };
        expectedResult = service.addSmeToCollectionIfMissing([], sme, sme2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sme);
        expect(expectedResult).toContain(sme2);
      });

      it('should accept null and undefined values', () => {
        const sme: ISme = { id: 123 };
        expectedResult = service.addSmeToCollectionIfMissing([], null, sme, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sme);
      });

      it('should return initial array if no Sme is added', () => {
        const smeCollection: ISme[] = [{ id: 123 }];
        expectedResult = service.addSmeToCollectionIfMissing(smeCollection, undefined, null);
        expect(expectedResult).toEqual(smeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
