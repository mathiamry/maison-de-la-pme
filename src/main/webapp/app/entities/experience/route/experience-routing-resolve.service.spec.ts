jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IExperience, Experience } from '../experience.model';
import { ExperienceService } from '../service/experience.service';

import { ExperienceRoutingResolveService } from './experience-routing-resolve.service';

describe('Experience routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ExperienceRoutingResolveService;
  let service: ExperienceService;
  let resultExperience: IExperience | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ExperienceRoutingResolveService);
    service = TestBed.inject(ExperienceService);
    resultExperience = undefined;
  });

  describe('resolve', () => {
    it('should return IExperience returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExperience = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultExperience).toEqual({ id: 123 });
    });

    it('should return new IExperience if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExperience = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultExperience).toEqual(new Experience());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Experience })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExperience = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultExperience).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
