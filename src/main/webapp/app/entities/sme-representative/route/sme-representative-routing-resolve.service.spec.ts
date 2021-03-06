import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISmeRepresentative, SmeRepresentative } from '../sme-representative.model';
import { SmeRepresentativeService } from '../service/sme-representative.service';

import { SmeRepresentativeRoutingResolveService } from './sme-representative-routing-resolve.service';

describe('SmeRepresentative routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SmeRepresentativeRoutingResolveService;
  let service: SmeRepresentativeService;
  let resultSmeRepresentative: ISmeRepresentative | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(SmeRepresentativeRoutingResolveService);
    service = TestBed.inject(SmeRepresentativeService);
    resultSmeRepresentative = undefined;
  });

  describe('resolve', () => {
    it('should return ISmeRepresentative returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSmeRepresentative = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSmeRepresentative).toEqual({ id: 123 });
    });

    it('should return new ISmeRepresentative if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSmeRepresentative = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSmeRepresentative).toEqual(new SmeRepresentative());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SmeRepresentative })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSmeRepresentative = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSmeRepresentative).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
