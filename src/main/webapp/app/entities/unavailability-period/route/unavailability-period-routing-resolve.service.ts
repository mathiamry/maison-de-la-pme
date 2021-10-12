import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUnavailabilityPeriod, UnavailabilityPeriod } from '../unavailability-period.model';
import { UnavailabilityPeriodService } from '../service/unavailability-period.service';

@Injectable({ providedIn: 'root' })
export class UnavailabilityPeriodRoutingResolveService implements Resolve<IUnavailabilityPeriod> {
  constructor(protected service: UnavailabilityPeriodService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUnavailabilityPeriod> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((unavailabilityPeriod: HttpResponse<UnavailabilityPeriod>) => {
          if (unavailabilityPeriod.body) {
            return of(unavailabilityPeriod.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UnavailabilityPeriod());
  }
}
