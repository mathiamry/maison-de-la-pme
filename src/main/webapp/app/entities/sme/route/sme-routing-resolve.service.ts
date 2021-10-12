import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISme, Sme } from '../sme.model';
import { SmeService } from '../service/sme.service';

@Injectable({ providedIn: 'root' })
export class SmeRoutingResolveService implements Resolve<ISme> {
  constructor(protected service: SmeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISme> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sme: HttpResponse<Sme>) => {
          if (sme.body) {
            return of(sme.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Sme());
  }
}
