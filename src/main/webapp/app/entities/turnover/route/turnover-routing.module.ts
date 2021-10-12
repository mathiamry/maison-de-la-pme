import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TurnoverComponent } from '../list/turnover.component';
import { TurnoverDetailComponent } from '../detail/turnover-detail.component';
import { TurnoverUpdateComponent } from '../update/turnover-update.component';
import { TurnoverRoutingResolveService } from './turnover-routing-resolve.service';

const turnoverRoute: Routes = [
  {
    path: '',
    component: TurnoverComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TurnoverDetailComponent,
    resolve: {
      turnover: TurnoverRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TurnoverUpdateComponent,
    resolve: {
      turnover: TurnoverRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TurnoverUpdateComponent,
    resolve: {
      turnover: TurnoverRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(turnoverRoute)],
  exports: [RouterModule],
})
export class TurnoverRoutingModule {}
