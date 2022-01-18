import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAppointmentObject, AppointmentObject } from '../appointment-object.model';
import { AppointmentObjectService } from '../service/appointment-object.service';

@Injectable({ providedIn: 'root' })
export class AppointmentObjectRoutingResolveService implements Resolve<IAppointmentObject> {
  constructor(protected service: AppointmentObjectService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAppointmentObject> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((appointmentObject: HttpResponse<AppointmentObject>) => {
          if (appointmentObject.body) {
            return of(appointmentObject.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AppointmentObject());
  }
}
