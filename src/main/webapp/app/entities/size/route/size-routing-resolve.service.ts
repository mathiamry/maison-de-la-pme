import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISize, Size } from '../size.model';
import { SizeService } from '../service/size.service';

@Injectable({ providedIn: 'root' })
export class SizeRoutingResolveService implements Resolve<ISize> {
  constructor(protected service: SizeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISize> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((size: HttpResponse<Size>) => {
          if (size.body) {
            return of(size.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Size());
  }
}
