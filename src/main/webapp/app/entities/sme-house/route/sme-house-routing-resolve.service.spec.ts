jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISMEHouse, SMEHouse } from '../sme-house.model';
import { SMEHouseService } from '../service/sme-house.service';

import { SMEHouseRoutingResolveService } from './sme-house-routing-resolve.service';

describe('SMEHouse routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SMEHouseRoutingResolveService;
  let service: SMEHouseService;
  let resultSMEHouse: ISMEHouse | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(SMEHouseRoutingResolveService);
    service = TestBed.inject(SMEHouseService);
    resultSMEHouse = undefined;
  });

  describe('resolve', () => {
    it('should return ISMEHouse returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSMEHouse = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSMEHouse).toEqual({ id: 123 });
    });

    it('should return new ISMEHouse if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSMEHouse = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSMEHouse).toEqual(new SMEHouse());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SMEHouse })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSMEHouse = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSMEHouse).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
