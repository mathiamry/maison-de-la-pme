import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISmeRepresentative, SmeRepresentative } from '../sme-representative.model';
import { SmeRepresentativeService } from '../service/sme-representative.service';

@Injectable({ providedIn: 'root' })
export class SmeRepresentativeRoutingResolveService implements Resolve<ISmeRepresentative> {
  constructor(protected service: SmeRepresentativeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISmeRepresentative> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((smeRepresentative: HttpResponse<SmeRepresentative>) => {
          if (smeRepresentative.body) {
            return of(smeRepresentative.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SmeRepresentative());
  }
}
