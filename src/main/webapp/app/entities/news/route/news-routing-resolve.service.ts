import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INews, News } from '../news.model';
import { NewsService } from '../service/news.service';

@Injectable({ providedIn: 'root' })
export class NewsRoutingResolveService implements Resolve<INews> {
  constructor(protected service: NewsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INews> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((news: HttpResponse<News>) => {
          if (news.body) {
            return of(news.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new News());
  }
}
