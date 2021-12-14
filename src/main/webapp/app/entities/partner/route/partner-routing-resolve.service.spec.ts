jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPartner, Partner } from '../partner.model';
import { PartnerService } from '../service/partner.service';

import { PartnerRoutingResolveService } from './partner-routing-resolve.service';

describe('Partner routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PartnerRoutingResolveService;
  let service: PartnerService;
  let resultPartner: IPartner | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(PartnerRoutingResolveService);
    service = TestBed.inject(PartnerService);
    resultPartner = undefined;
  });

  describe('resolve', () => {
    it('should return IPartner returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPartner = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPartner).toEqual({ id: 123 });
    });

    it('should return new IPartner if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPartner = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPartner).toEqual(new Partner());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Partner })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPartner = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPartner).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
