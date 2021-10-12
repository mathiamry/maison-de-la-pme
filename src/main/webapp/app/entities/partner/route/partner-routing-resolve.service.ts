import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPartner, Partner } from '../partner.model';
import { PartnerService } from '../service/partner.service';

@Injectable({ providedIn: 'root' })
export class PartnerRoutingResolveService implements Resolve<IPartner> {
  constructor(protected service: PartnerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartner> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partner: HttpResponse<Partner>) => {
          if (partner.body) {
            return of(partner.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Partner());
  }
}
