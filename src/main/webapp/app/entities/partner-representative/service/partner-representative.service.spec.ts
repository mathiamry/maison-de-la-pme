import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPartnerRepresentative, PartnerRepresentative } from '../partner-representative.model';

import { PartnerRepresentativeService } from './partner-representative.service';

describe('PartnerRepresentative Service', () => {
  let service: PartnerRepresentativeService;
  let httpMock: HttpTestingController;
  let elemDefault: IPartnerRepresentative;
  let expectedResult: IPartnerRepresentative | IPartnerRepresentative[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PartnerRepresentativeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      jobTitle: 'AAAAAAA',
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

    it('should create a PartnerRepresentative', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PartnerRepresentative()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PartnerRepresentative', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          jobTitle: 'BBBBBB',
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

    it('should partial update a PartnerRepresentative', () => {
      const patchObject = Object.assign(
        {
          jobTitle: 'BBBBBB',
        },
        new PartnerRepresentative()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PartnerRepresentative', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          jobTitle: 'BBBBBB',
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

    it('should delete a PartnerRepresentative', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPartnerRepresentativeToCollectionIfMissing', () => {
      it('should add a PartnerRepresentative to an empty array', () => {
        const partnerRepresentative: IPartnerRepresentative = { id: 123 };
        expectedResult = service.addPartnerRepresentativeToCollectionIfMissing([], partnerRepresentative);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(partnerRepresentative);
      });

      it('should not add a PartnerRepresentative to an array that contains it', () => {
        const partnerRepresentative: IPartnerRepresentative = { id: 123 };
        const partnerRepresentativeCollection: IPartnerRepresentative[] = [
          {
            ...partnerRepresentative,
          },
          { id: 456 },
        ];
        expectedResult = service.addPartnerRepresentativeToCollectionIfMissing(partnerRepresentativeCollection, partnerRepresentative);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PartnerRepresentative to an array that doesn't contain it", () => {
        const partnerRepresentative: IPartnerRepresentative = { id: 123 };
        const partnerRepresentativeCollection: IPartnerRepresentative[] = [{ id: 456 }];
        expectedResult = service.addPartnerRepresentativeToCollectionIfMissing(partnerRepresentativeCollection, partnerRepresentative);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(partnerRepresentative);
      });

      it('should add only unique PartnerRepresentative to an array', () => {
        const partnerRepresentativeArray: IPartnerRepresentative[] = [{ id: 123 }, { id: 456 }, { id: 10699 }];
        const partnerRepresentativeCollection: IPartnerRepresentative[] = [{ id: 123 }];
        expectedResult = service.addPartnerRepresentativeToCollectionIfMissing(
          partnerRepresentativeCollection,
          ...partnerRepresentativeArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const partnerRepresentative: IPartnerRepresentative = { id: 123 };
        const partnerRepresentative2: IPartnerRepresentative = { id: 456 };
        expectedResult = service.addPartnerRepresentativeToCollectionIfMissing([], partnerRepresentative, partnerRepresentative2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(partnerRepresentative);
        expect(expectedResult).toContain(partnerRepresentative2);
      });

      it('should accept null and undefined values', () => {
        const partnerRepresentative: IPartnerRepresentative = { id: 123 };
        expectedResult = service.addPartnerRepresentativeToCollectionIfMissing([], null, partnerRepresentative, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(partnerRepresentative);
      });

      it('should return initial array if no PartnerRepresentative is added', () => {
        const partnerRepresentativeCollection: IPartnerRepresentative[] = [{ id: 123 }];
        expectedResult = service.addPartnerRepresentativeToCollectionIfMissing(partnerRepresentativeCollection, undefined, null);
        expect(expectedResult).toEqual(partnerRepresentativeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
