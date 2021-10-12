import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAvailabilityTimeslot, AvailabilityTimeslot } from '../availability-timeslot.model';
import { AvailabilityTimeslotService } from '../service/availability-timeslot.service';

@Injectable({ providedIn: 'root' })
export class AvailabilityTimeslotRoutingResolveService implements Resolve<IAvailabilityTimeslot> {
  constructor(protected service: AvailabilityTimeslotService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAvailabilityTimeslot> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((availabilityTimeslot: HttpResponse<AvailabilityTimeslot>) => {
          if (availabilityTimeslot.body) {
            return of(availabilityTimeslot.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AvailabilityTimeslot());
  }
}
