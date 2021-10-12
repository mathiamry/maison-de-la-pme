import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActivityArea, ActivityArea } from '../activity-area.model';
import { ActivityAreaService } from '../service/activity-area.service';

@Injectable({ providedIn: 'root' })
export class ActivityAreaRoutingResolveService implements Resolve<IActivityArea> {
  constructor(protected service: ActivityAreaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActivityArea> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((activityArea: HttpResponse<ActivityArea>) => {
          if (activityArea.body) {
            return of(activityArea.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ActivityArea());
  }
}
