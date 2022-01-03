import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAdministrator, Administrator } from '../administrator.model';

import { AdministratorService } from './administrator.service';

describe('Administrator Service', () => {
  let service: AdministratorService;
  let httpMock: HttpTestingController;
  let elemDefault: IAdministrator;
  let expectedResult: IAdministrator | IAdministrator[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AdministratorService);
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

    it('should create a Administrator', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Administrator()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Administrator', () => {
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

    it('should partial update a Administrator', () => {
      const patchObject = Object.assign(
        {
          jobTitle: 'BBBBBB',
        },
        new Administrator()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Administrator', () => {
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

    it('should delete a Administrator', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAdministratorToCollectionIfMissing', () => {
      it('should add a Administrator to an empty array', () => {
        const administrator: IAdministrator = { id: 123 };
        expectedResult = service.addAdministratorToCollectionIfMissing([], administrator);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(administrator);
      });

      it('should not add a Administrator to an array that contains it', () => {
        const administrator: IAdministrator = { id: 123 };
        const administratorCollection: IAdministrator[] = [
          {
            ...administrator,
          },
          { id: 456 },
        ];
        expectedResult = service.addAdministratorToCollectionIfMissing(administratorCollection, administrator);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Administrator to an array that doesn't contain it", () => {
        const administrator: IAdministrator = { id: 123 };
        const administratorCollection: IAdministrator[] = [{ id: 456 }];
        expectedResult = service.addAdministratorToCollectionIfMissing(administratorCollection, administrator);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(administrator);
      });

      it('should add only unique Administrator to an array', () => {
        const administratorArray: IAdministrator[] = [{ id: 123 }, { id: 456 }, { id: 32611 }];
        const administratorCollection: IAdministrator[] = [{ id: 123 }];
        expectedResult = service.addAdministratorToCollectionIfMissing(administratorCollection, ...administratorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const administrator: IAdministrator = { id: 123 };
        const administrator2: IAdministrator = { id: 456 };
        expectedResult = service.addAdministratorToCollectionIfMissing([], administrator, administrator2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(administrator);
        expect(expectedResult).toContain(administrator2);
      });

      it('should accept null and undefined values', () => {
        const administrator: IAdministrator = { id: 123 };
        expectedResult = service.addAdministratorToCollectionIfMissing([], null, administrator, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(administrator);
      });

      it('should return initial array if no Administrator is added', () => {
        const administratorCollection: IAdministrator[] = [{ id: 123 }];
        expectedResult = service.addAdministratorToCollectionIfMissing(administratorCollection, undefined, null);
        expect(expectedResult).toEqual(administratorCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
