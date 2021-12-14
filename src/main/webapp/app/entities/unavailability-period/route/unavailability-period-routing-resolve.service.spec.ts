jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IUnavailabilityPeriod, UnavailabilityPeriod } from '../unavailability-period.model';
import { UnavailabilityPeriodService } from '../service/unavailability-period.service';

import { UnavailabilityPeriodRoutingResolveService } from './unavailability-period-routing-resolve.service';

describe('UnavailabilityPeriod routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: UnavailabilityPeriodRoutingResolveService;
  let service: UnavailabilityPeriodService;
  let resultUnavailabilityPeriod: IUnavailabilityPeriod | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(UnavailabilityPeriodRoutingResolveService);
    service = TestBed.inject(UnavailabilityPeriodService);
    resultUnavailabilityPeriod = undefined;
  });

  describe('resolve', () => {
    it('should return IUnavailabilityPeriod returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUnavailabilityPeriod = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultUnavailabilityPeriod).toEqual({ id: 123 });
    });

    it('should return new IUnavailabilityPeriod if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUnavailabilityPeriod = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultUnavailabilityPeriod).toEqual(new UnavailabilityPeriod());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as UnavailabilityPeriod })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUnavailabilityPeriod = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultUnavailabilityPeriod).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
