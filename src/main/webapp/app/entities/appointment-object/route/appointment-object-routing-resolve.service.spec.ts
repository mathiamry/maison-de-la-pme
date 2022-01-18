import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAppointmentObject, AppointmentObject } from '../appointment-object.model';
import { AppointmentObjectService } from '../service/appointment-object.service';

import { AppointmentObjectRoutingResolveService } from './appointment-object-routing-resolve.service';

describe('AppointmentObject routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AppointmentObjectRoutingResolveService;
  let service: AppointmentObjectService;
  let resultAppointmentObject: IAppointmentObject | undefined;

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
    routingResolveService = TestBed.inject(AppointmentObjectRoutingResolveService);
    service = TestBed.inject(AppointmentObjectService);
    resultAppointmentObject = undefined;
  });

  describe('resolve', () => {
    it('should return IAppointmentObject returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAppointmentObject = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAppointmentObject).toEqual({ id: 123 });
    });

    it('should return new IAppointmentObject if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAppointmentObject = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAppointmentObject).toEqual(new AppointmentObject());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AppointmentObject })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAppointmentObject = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAppointmentObject).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
