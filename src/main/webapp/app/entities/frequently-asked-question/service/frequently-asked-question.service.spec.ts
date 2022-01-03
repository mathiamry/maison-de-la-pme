import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFrequentlyAskedQuestion, FrequentlyAskedQuestion } from '../frequently-asked-question.model';

import { FrequentlyAskedQuestionService } from './frequently-asked-question.service';

describe('FrequentlyAskedQuestion Service', () => {
  let service: FrequentlyAskedQuestionService;
  let httpMock: HttpTestingController;
  let elemDefault: IFrequentlyAskedQuestion;
  let expectedResult: IFrequentlyAskedQuestion | IFrequentlyAskedQuestion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FrequentlyAskedQuestionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      question: 'AAAAAAA',
      answer: 'AAAAAAA',
      order: 0,
      isPublished: false,
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

    it('should create a FrequentlyAskedQuestion', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new FrequentlyAskedQuestion()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FrequentlyAskedQuestion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          question: 'BBBBBB',
          answer: 'BBBBBB',
          order: 1,
          isPublished: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FrequentlyAskedQuestion', () => {
      const patchObject = Object.assign(
        {
          isPublished: true,
        },
        new FrequentlyAskedQuestion()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FrequentlyAskedQuestion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          question: 'BBBBBB',
          answer: 'BBBBBB',
          order: 1,
          isPublished: true,
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

    it('should delete a FrequentlyAskedQuestion', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFrequentlyAskedQuestionToCollectionIfMissing', () => {
      it('should add a FrequentlyAskedQuestion to an empty array', () => {
        const frequentlyAskedQuestion: IFrequentlyAskedQuestion = { id: 123 };
        expectedResult = service.addFrequentlyAskedQuestionToCollectionIfMissing([], frequentlyAskedQuestion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(frequentlyAskedQuestion);
      });

      it('should not add a FrequentlyAskedQuestion to an array that contains it', () => {
        const frequentlyAskedQuestion: IFrequentlyAskedQuestion = { id: 123 };
        const frequentlyAskedQuestionCollection: IFrequentlyAskedQuestion[] = [
          {
            ...frequentlyAskedQuestion,
          },
          { id: 456 },
        ];
        expectedResult = service.addFrequentlyAskedQuestionToCollectionIfMissing(
          frequentlyAskedQuestionCollection,
          frequentlyAskedQuestion
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FrequentlyAskedQuestion to an array that doesn't contain it", () => {
        const frequentlyAskedQuestion: IFrequentlyAskedQuestion = { id: 123 };
        const frequentlyAskedQuestionCollection: IFrequentlyAskedQuestion[] = [{ id: 456 }];
        expectedResult = service.addFrequentlyAskedQuestionToCollectionIfMissing(
          frequentlyAskedQuestionCollection,
          frequentlyAskedQuestion
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(frequentlyAskedQuestion);
      });

      it('should add only unique FrequentlyAskedQuestion to an array', () => {
        const frequentlyAskedQuestionArray: IFrequentlyAskedQuestion[] = [{ id: 123 }, { id: 456 }, { id: 39762 }];
        const frequentlyAskedQuestionCollection: IFrequentlyAskedQuestion[] = [{ id: 123 }];
        expectedResult = service.addFrequentlyAskedQuestionToCollectionIfMissing(
          frequentlyAskedQuestionCollection,
          ...frequentlyAskedQuestionArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const frequentlyAskedQuestion: IFrequentlyAskedQuestion = { id: 123 };
        const frequentlyAskedQuestion2: IFrequentlyAskedQuestion = { id: 456 };
        expectedResult = service.addFrequentlyAskedQuestionToCollectionIfMissing([], frequentlyAskedQuestion, frequentlyAskedQuestion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(frequentlyAskedQuestion);
        expect(expectedResult).toContain(frequentlyAskedQuestion2);
      });

      it('should accept null and undefined values', () => {
        const frequentlyAskedQuestion: IFrequentlyAskedQuestion = { id: 123 };
        expectedResult = service.addFrequentlyAskedQuestionToCollectionIfMissing([], null, frequentlyAskedQuestion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(frequentlyAskedQuestion);
      });

      it('should return initial array if no FrequentlyAskedQuestion is added', () => {
        const frequentlyAskedQuestionCollection: IFrequentlyAskedQuestion[] = [{ id: 123 }];
        expectedResult = service.addFrequentlyAskedQuestionToCollectionIfMissing(frequentlyAskedQuestionCollection, undefined, null);
        expect(expectedResult).toEqual(frequentlyAskedQuestionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
