import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPartnerRepresentative, PartnerRepresentative } from '../partner-representative.model';
import { PartnerRepresentativeService } from '../service/partner-representative.service';

@Injectable({ providedIn: 'root' })
export class PartnerRepresentativeRoutingResolveService implements Resolve<IPartnerRepresentative> {
  constructor(protected service: PartnerRepresentativeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartnerRepresentative> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partnerRepresentative: HttpResponse<PartnerRepresentative>) => {
          if (partnerRepresentative.body) {
            return of(partnerRepresentative.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PartnerRepresentative());
  }
}
