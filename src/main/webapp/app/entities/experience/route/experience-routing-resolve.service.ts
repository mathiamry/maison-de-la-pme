import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExperience, Experience } from '../experience.model';
import { ExperienceService } from '../service/experience.service';

@Injectable({ providedIn: 'root' })
export class ExperienceRoutingResolveService implements Resolve<IExperience> {
  constructor(protected service: ExperienceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExperience> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((experience: HttpResponse<Experience>) => {
          if (experience.body) {
            return of(experience.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Experience());
  }
}
