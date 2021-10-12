import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FrequentlyAskedQuestionComponent } from '../list/frequently-asked-question.component';
import { FrequentlyAskedQuestionDetailComponent } from '../detail/frequently-asked-question-detail.component';
import { FrequentlyAskedQuestionUpdateComponent } from '../update/frequently-asked-question-update.component';
import { FrequentlyAskedQuestionRoutingResolveService } from './frequently-asked-question-routing-resolve.service';

const frequentlyAskedQuestionRoute: Routes = [
  {
    path: '',
    component: FrequentlyAskedQuestionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FrequentlyAskedQuestionDetailComponent,
    resolve: {
      frequentlyAskedQuestion: FrequentlyAskedQuestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FrequentlyAskedQuestionUpdateComponent,
    resolve: {
      frequentlyAskedQuestion: FrequentlyAskedQuestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FrequentlyAskedQuestionUpdateComponent,
    resolve: {
      frequentlyAskedQuestion: FrequentlyAskedQuestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(frequentlyAskedQuestionRoute)],
  exports: [RouterModule],
})
export class FrequentlyAskedQuestionRoutingModule {}
