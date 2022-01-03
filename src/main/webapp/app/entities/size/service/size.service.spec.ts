import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISize, Size } from '../size.model';

import { SizeService } from './size.service';

describe('Size Service', () => {
  let service: SizeService;
  let httpMock: HttpTestingController;
  let elemDefault: ISize;
  let expectedResult: ISize | ISize[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SizeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      min: 0,
      max: 0,
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

    it('should create a Size', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Size()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Size', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          min: 1,
          max: 1,
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

    it('should partial update a Size', () => {
      const patchObject = Object.assign(
        {
          min: 1,
          max: 1,
        },
        new Size()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Size', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          min: 1,
          max: 1,
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

    it('should delete a Size', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSizeToCollectionIfMissing', () => {
      it('should add a Size to an empty array', () => {
        const size: ISize = { id: 123 };
        expectedResult = service.addSizeToCollectionIfMissing([], size);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(size);
      });

      it('should not add a Size to an array that contains it', () => {
        const size: ISize = { id: 123 };
        const sizeCollection: ISize[] = [
          {
            ...size,
          },
          { id: 456 },
        ];
        expectedResult = service.addSizeToCollectionIfMissing(sizeCollection, size);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Size to an array that doesn't contain it", () => {
        const size: ISize = { id: 123 };
        const sizeCollection: ISize[] = [{ id: 456 }];
        expectedResult = service.addSizeToCollectionIfMissing(sizeCollection, size);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(size);
      });

      it('should add only unique Size to an array', () => {
        const sizeArray: ISize[] = [{ id: 123 }, { id: 456 }, { id: 97972 }];
        const sizeCollection: ISize[] = [{ id: 123 }];
        expectedResult = service.addSizeToCollectionIfMissing(sizeCollection, ...sizeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const size: ISize = { id: 123 };
        const size2: ISize = { id: 456 };
        expectedResult = service.addSizeToCollectionIfMissing([], size, size2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(size);
        expect(expectedResult).toContain(size2);
      });

      it('should accept null and undefined values', () => {
        const size: ISize = { id: 123 };
        expectedResult = service.addSizeToCollectionIfMissing([], null, size, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(size);
      });

      it('should return initial array if no Size is added', () => {
        const sizeCollection: ISize[] = [{ id: 123 }];
        expectedResult = service.addSizeToCollectionIfMissing(sizeCollection, undefined, null);
        expect(expectedResult).toEqual(sizeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
