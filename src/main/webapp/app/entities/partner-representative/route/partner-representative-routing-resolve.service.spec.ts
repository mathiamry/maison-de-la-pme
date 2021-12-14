jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPartnerRepresentative, PartnerRepresentative } from '../partner-representative.model';
import { PartnerRepresentativeService } from '../service/partner-representative.service';

import { PartnerRepresentativeRoutingResolveService } from './partner-representative-routing-resolve.service';

describe('PartnerRepresentative routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PartnerRepresentativeRoutingResolveService;
  let service: PartnerRepresentativeService;
  let resultPartnerRepresentative: IPartnerRepresentative | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(PartnerRepresentativeRoutingResolveService);
    service = TestBed.inject(PartnerRepresentativeService);
    resultPartnerRepresentative = undefined;
  });

  describe('resolve', () => {
    it('should return IPartnerRepresentative returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPartnerRepresentative = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPartnerRepresentative).toEqual({ id: 123 });
    });

    it('should return new IPartnerRepresentative if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPartnerRepresentative = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPartnerRepresentative).toEqual(new PartnerRepresentative());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PartnerRepresentative })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPartnerRepresentative = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPartnerRepresentative).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
