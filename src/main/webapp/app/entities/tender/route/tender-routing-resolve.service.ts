import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITender, Tender } from '../tender.model';
import { TenderService } from '../service/tender.service';

@Injectable({ providedIn: 'root' })
export class TenderRoutingResolveService implements Resolve<ITender> {
  constructor(protected service: TenderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITender> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tender: HttpResponse<Tender>) => {
          if (tender.body) {
            return of(tender.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Tender());
  }
}
