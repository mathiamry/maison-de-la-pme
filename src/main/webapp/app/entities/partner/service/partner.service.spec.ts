import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPartner, Partner } from '../partner.model';

import { PartnerService } from './partner.service';

describe('Partner Service', () => {
  let service: PartnerService;
  let httpMock: HttpTestingController;
  let elemDefault: IPartner;
  let expectedResult: IPartner | IPartner[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PartnerService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      address: 'AAAAAAA',
      email: 'AAAAAAA',
      phone: 'AAAAAAA',
      logo: 'AAAAAAA',
      latitude: 'AAAAAAA',
      longitude: 'AAAAAAA',
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

    it('should create a Partner', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Partner()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Partner', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          address: 'BBBBBB',
          email: 'BBBBBB',
          phone: 'BBBBBB',
          logo: 'BBBBBB',
          latitude: 'BBBBBB',
          longitude: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Partner', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          address: 'BBBBBB',
          email: 'BBBBBB',
          phone: 'BBBBBB',
          logo: 'BBBBBB',
          latitude: 'BBBBBB',
        },
        new Partner()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Partner', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          address: 'BBBBBB',
          email: 'BBBBBB',
          phone: 'BBBBBB',
          logo: 'BBBBBB',
          latitude: 'BBBBBB',
          longitude: 'BBBBBB',
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

    it('should delete a Partner', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPartnerToCollectionIfMissing', () => {
      it('should add a Partner to an empty array', () => {
        const partner: IPartner = { id: 123 };
        expectedResult = service.addPartnerToCollectionIfMissing([], partner);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(partner);
      });

      it('should not add a Partner to an array that contains it', () => {
        const partner: IPartner = { id: 123 };
        const partnerCollection: IPartner[] = [
          {
            ...partner,
          },
          { id: 456 },
        ];
        expectedResult = service.addPartnerToCollectionIfMissing(partnerCollection, partner);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Partner to an array that doesn't contain it", () => {
        const partner: IPartner = { id: 123 };
        const partnerCollection: IPartner[] = [{ id: 456 }];
        expectedResult = service.addPartnerToCollectionIfMissing(partnerCollection, partner);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(partner);
      });

      it('should add only unique Partner to an array', () => {
        const partnerArray: IPartner[] = [{ id: 123 }, { id: 456 }, { id: 43520 }];
        const partnerCollection: IPartner[] = [{ id: 123 }];
        expectedResult = service.addPartnerToCollectionIfMissing(partnerCollection, ...partnerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const partner: IPartner = { id: 123 };
        const partner2: IPartner = { id: 456 };
        expectedResult = service.addPartnerToCollectionIfMissing([], partner, partner2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(partner);
        expect(expectedResult).toContain(partner2);
      });

      it('should accept null and undefined values', () => {
        const partner: IPartner = { id: 123 };
        expectedResult = service.addPartnerToCollectionIfMissing([], null, partner, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(partner);
      });

      it('should return initial array if no Partner is added', () => {
        const partnerCollection: IPartner[] = [{ id: 123 }];
        expectedResult = service.addPartnerToCollectionIfMissing(partnerCollection, undefined, null);
        expect(expectedResult).toEqual(partnerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
