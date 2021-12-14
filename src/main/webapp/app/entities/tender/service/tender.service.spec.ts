import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITender, Tender } from '../tender.model';

import { TenderService } from './tender.service';

describe('Tender Service', () => {
  let service: TenderService;
  let httpMock: HttpTestingController;
  let elemDefault: ITender;
  let expectedResult: ITender | ITender[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TenderService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      description: 'AAAAAAA',
      publishDate: currentDate,
      expiryDate: currentDate,
      isValid: false,
      isArchived: false,
      isPublished: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          publishDate: currentDate.format(DATE_TIME_FORMAT),
          expiryDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Tender', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          publishDate: currentDate.format(DATE_TIME_FORMAT),
          expiryDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          publishDate: currentDate,
          expiryDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Tender()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Tender', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
          publishDate: currentDate.format(DATE_TIME_FORMAT),
          expiryDate: currentDate.format(DATE_TIME_FORMAT),
          isValid: true,
          isArchived: true,
          isPublished: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          publishDate: currentDate,
          expiryDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Tender', () => {
      const patchObject = Object.assign(
        {
          title: 'BBBBBB',
          description: 'BBBBBB',
        },
        new Tender()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          publishDate: currentDate,
          expiryDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Tender', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
          publishDate: currentDate.format(DATE_TIME_FORMAT),
          expiryDate: currentDate.format(DATE_TIME_FORMAT),
          isValid: true,
          isArchived: true,
          isPublished: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          publishDate: currentDate,
          expiryDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Tender', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTenderToCollectionIfMissing', () => {
      it('should add a Tender to an empty array', () => {
        const tender: ITender = { id: 123 };
        expectedResult = service.addTenderToCollectionIfMissing([], tender);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tender);
      });

      it('should not add a Tender to an array that contains it', () => {
        const tender: ITender = { id: 123 };
        const tenderCollection: ITender[] = [
          {
            ...tender,
          },
          { id: 456 },
        ];
        expectedResult = service.addTenderToCollectionIfMissing(tenderCollection, tender);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Tender to an array that doesn't contain it", () => {
        const tender: ITender = { id: 123 };
        const tenderCollection: ITender[] = [{ id: 456 }];
        expectedResult = service.addTenderToCollectionIfMissing(tenderCollection, tender);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tender);
      });

      it('should add only unique Tender to an array', () => {
        const tenderArray: ITender[] = [{ id: 123 }, { id: 456 }, { id: 88915 }];
        const tenderCollection: ITender[] = [{ id: 123 }];
        expectedResult = service.addTenderToCollectionIfMissing(tenderCollection, ...tenderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tender: ITender = { id: 123 };
        const tender2: ITender = { id: 456 };
        expectedResult = service.addTenderToCollectionIfMissing([], tender, tender2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tender);
        expect(expectedResult).toContain(tender2);
      });

      it('should accept null and undefined values', () => {
        const tender: ITender = { id: 123 };
        expectedResult = service.addTenderToCollectionIfMissing([], null, tender, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tender);
      });

      it('should return initial array if no Tender is added', () => {
        const tenderCollection: ITender[] = [{ id: 123 }];
        expectedResult = service.addTenderToCollectionIfMissing(tenderCollection, undefined, null);
        expect(expectedResult).toEqual(tenderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
