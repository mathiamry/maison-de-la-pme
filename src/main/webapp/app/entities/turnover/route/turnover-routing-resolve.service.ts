import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITurnover, Turnover } from '../turnover.model';
import { TurnoverService } from '../service/turnover.service';

@Injectable({ providedIn: 'root' })
export class TurnoverRoutingResolveService implements Resolve<ITurnover> {
  constructor(protected service: TurnoverService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITurnover> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((turnover: HttpResponse<Turnover>) => {
          if (turnover.body) {
            return of(turnover.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Turnover());
  }
}
