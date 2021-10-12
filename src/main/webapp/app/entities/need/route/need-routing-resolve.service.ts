import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INeed, Need } from '../need.model';
import { NeedService } from '../service/need.service';

@Injectable({ providedIn: 'root' })
export class NeedRoutingResolveService implements Resolve<INeed> {
  constructor(protected service: NeedService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INeed> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((need: HttpResponse<Need>) => {
          if (need.body) {
            return of(need.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Need());
  }
}
