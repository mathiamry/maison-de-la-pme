jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITurnover, Turnover } from '../turnover.model';
import { TurnoverService } from '../service/turnover.service';

import { TurnoverRoutingResolveService } from './turnover-routing-resolve.service';

describe('Turnover routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TurnoverRoutingResolveService;
  let service: TurnoverService;
  let resultTurnover: ITurnover | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(TurnoverRoutingResolveService);
    service = TestBed.inject(TurnoverService);
    resultTurnover = undefined;
  });

  describe('resolve', () => {
    it('should return ITurnover returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTurnover = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTurnover).toEqual({ id: 123 });
    });

    it('should return new ITurnover if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTurnover = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTurnover).toEqual(new Turnover());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Turnover })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTurnover = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTurnover).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
