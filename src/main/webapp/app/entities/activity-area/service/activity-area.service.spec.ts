import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActivityArea, ActivityArea } from '../activity-area.model';

import { ActivityAreaService } from './activity-area.service';

describe('ActivityArea Service', () => {
  let service: ActivityAreaService;
  let httpMock: HttpTestingController;
  let elemDefault: IActivityArea;
  let expectedResult: IActivityArea | IActivityArea[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActivityAreaService);
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

    it('should create a ActivityArea', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ActivityArea()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ActivityArea', () => {
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

    it('should partial update a ActivityArea', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new ActivityArea()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ActivityArea', () => {
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

    it('should delete a ActivityArea', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addActivityAreaToCollectionIfMissing', () => {
      it('should add a ActivityArea to an empty array', () => {
        const activityArea: IActivityArea = { id: 123 };
        expectedResult = service.addActivityAreaToCollectionIfMissing([], activityArea);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activityArea);
      });

      it('should not add a ActivityArea to an array that contains it', () => {
        const activityArea: IActivityArea = { id: 123 };
        const activityAreaCollection: IActivityArea[] = [
          {
            ...activityArea,
          },
          { id: 456 },
        ];
        expectedResult = service.addActivityAreaToCollectionIfMissing(activityAreaCollection, activityArea);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ActivityArea to an array that doesn't contain it", () => {
        const activityArea: IActivityArea = { id: 123 };
        const activityAreaCollection: IActivityArea[] = [{ id: 456 }];
        expectedResult = service.addActivityAreaToCollectionIfMissing(activityAreaCollection, activityArea);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activityArea);
      });

      it('should add only unique ActivityArea to an array', () => {
        const activityAreaArray: IActivityArea[] = [{ id: 123 }, { id: 456 }, { id: 56824 }];
        const activityAreaCollection: IActivityArea[] = [{ id: 123 }];
        expectedResult = service.addActivityAreaToCollectionIfMissing(activityAreaCollection, ...activityAreaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const activityArea: IActivityArea = { id: 123 };
        const activityArea2: IActivityArea = { id: 456 };
        expectedResult = service.addActivityAreaToCollectionIfMissing([], activityArea, activityArea2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(activityArea);
        expect(expectedResult).toContain(activityArea2);
      });

      it('should accept null and undefined values', () => {
        const activityArea: IActivityArea = { id: 123 };
        expectedResult = service.addActivityAreaToCollectionIfMissing([], null, activityArea, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(activityArea);
      });

      it('should return initial array if no ActivityArea is added', () => {
        const activityAreaCollection: IActivityArea[] = [{ id: 123 }];
        expectedResult = service.addActivityAreaToCollectionIfMissing(activityAreaCollection, undefined, null);
        expect(expectedResult).toEqual(activityAreaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
