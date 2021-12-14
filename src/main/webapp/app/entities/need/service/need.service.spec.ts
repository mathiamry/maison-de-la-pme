import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { INeed, Need } from '../need.model';

import { NeedService } from './need.service';

describe('Need Service', () => {
  let service: NeedService;
  let httpMock: HttpTestingController;
  let elemDefault: INeed;
  let expectedResult: INeed | INeed[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NeedService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
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

    it('should create a Need', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Need()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Need', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Need', () => {
      const patchObject = Object.assign({}, new Need());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Need', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
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

    it('should delete a Need', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNeedToCollectionIfMissing', () => {
      it('should add a Need to an empty array', () => {
        const need: INeed = { id: 123 };
        expectedResult = service.addNeedToCollectionIfMissing([], need);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(need);
      });

      it('should not add a Need to an array that contains it', () => {
        const need: INeed = { id: 123 };
        const needCollection: INeed[] = [
          {
            ...need,
          },
          { id: 456 },
        ];
        expectedResult = service.addNeedToCollectionIfMissing(needCollection, need);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Need to an array that doesn't contain it", () => {
        const need: INeed = { id: 123 };
        const needCollection: INeed[] = [{ id: 456 }];
        expectedResult = service.addNeedToCollectionIfMissing(needCollection, need);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(need);
      });

      it('should add only unique Need to an array', () => {
        const needArray: INeed[] = [{ id: 123 }, { id: 456 }, { id: 23263 }];
        const needCollection: INeed[] = [{ id: 123 }];
        expectedResult = service.addNeedToCollectionIfMissing(needCollection, ...needArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const need: INeed = { id: 123 };
        const need2: INeed = { id: 456 };
        expectedResult = service.addNeedToCollectionIfMissing([], need, need2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(need);
        expect(expectedResult).toContain(need2);
      });

      it('should accept null and undefined values', () => {
        const need: INeed = { id: 123 };
        expectedResult = service.addNeedToCollectionIfMissing([], null, need, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(need);
      });

      it('should return initial array if no Need is added', () => {
        const needCollection: INeed[] = [{ id: 123 }];
        expectedResult = service.addNeedToCollectionIfMissing(needCollection, undefined, null);
        expect(expectedResult).toEqual(needCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
