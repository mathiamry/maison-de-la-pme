import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFrequentlyAskedQuestion, FrequentlyAskedQuestion } from '../frequently-asked-question.model';
import { FrequentlyAskedQuestionService } from '../service/frequently-asked-question.service';

@Injectable({ providedIn: 'root' })
export class FrequentlyAskedQuestionRoutingResolveService implements Resolve<IFrequentlyAskedQuestion> {
  constructor(protected service: FrequentlyAskedQuestionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFrequentlyAskedQuestion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((frequentlyAskedQuestion: HttpResponse<FrequentlyAskedQuestion>) => {
          if (frequentlyAskedQuestion.body) {
            return of(frequentlyAskedQuestion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FrequentlyAskedQuestion());
  }
}
