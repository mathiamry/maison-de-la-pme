import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISMEHouse, SMEHouse } from '../sme-house.model';
import { SMEHouseService } from '../service/sme-house.service';

@Injectable({ providedIn: 'root' })
export class SMEHouseRoutingResolveService implements Resolve<ISMEHouse> {
  constructor(protected service: SMEHouseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISMEHouse> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sMEHouse: HttpResponse<SMEHouse>) => {
          if (sMEHouse.body) {
            return of(sMEHouse.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SMEHouse());
  }
}
