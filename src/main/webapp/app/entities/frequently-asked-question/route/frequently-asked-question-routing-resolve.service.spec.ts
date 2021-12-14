jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFrequentlyAskedQuestion, FrequentlyAskedQuestion } from '../frequently-asked-question.model';
import { FrequentlyAskedQuestionService } from '../service/frequently-asked-question.service';

import { FrequentlyAskedQuestionRoutingResolveService } from './frequently-asked-question-routing-resolve.service';

describe('FrequentlyAskedQuestion routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FrequentlyAskedQuestionRoutingResolveService;
  let service: FrequentlyAskedQuestionService;
  let resultFrequentlyAskedQuestion: IFrequentlyAskedQuestion | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(FrequentlyAskedQuestionRoutingResolveService);
    service = TestBed.inject(FrequentlyAskedQuestionService);
    resultFrequentlyAskedQuestion = undefined;
  });

  describe('resolve', () => {
    it('should return IFrequentlyAskedQuestion returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFrequentlyAskedQuestion = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFrequentlyAskedQuestion).toEqual({ id: 123 });
    });

    it('should return new IFrequentlyAskedQuestion if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFrequentlyAskedQuestion = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFrequentlyAskedQuestion).toEqual(new FrequentlyAskedQuestion());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FrequentlyAskedQuestion })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFrequentlyAskedQuestion = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFrequentlyAskedQuestion).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
