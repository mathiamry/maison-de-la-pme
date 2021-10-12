import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnonymous, Anonymous } from '../anonymous.model';
import { AnonymousService } from '../service/anonymous.service';

@Injectable({ providedIn: 'root' })
export class AnonymousRoutingResolveService implements Resolve<IAnonymous> {
  constructor(protected service: AnonymousService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAnonymous> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((anonymous: HttpResponse<Anonymous>) => {
          if (anonymous.body) {
            return of(anonymous.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Anonymous());
  }
}
