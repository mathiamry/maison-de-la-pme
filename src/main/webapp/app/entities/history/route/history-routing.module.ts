import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HistoryComponent } from '../list/history.component';
import { HistoryDetailComponent } from '../detail/history-detail.component';
import { HistoryUpdateComponent } from '../update/history-update.component';
import { HistoryRoutingResolveService } from './history-routing-resolve.service';

const historyRoute: Routes = [
  {
    path: '',
    component: HistoryComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HistoryDetailComponent,
    resolve: {
      history: HistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HistoryUpdateComponent,
    resolve: {
      history: HistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HistoryUpdateComponent,
    resolve: {
      history: HistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(historyRoute)],
  exports: [RouterModule],
})
export class HistoryRoutingModule {}
