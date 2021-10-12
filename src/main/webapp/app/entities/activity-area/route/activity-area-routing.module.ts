import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActivityAreaComponent } from '../list/activity-area.component';
import { ActivityAreaDetailComponent } from '../detail/activity-area-detail.component';
import { ActivityAreaUpdateComponent } from '../update/activity-area-update.component';
import { ActivityAreaRoutingResolveService } from './activity-area-routing-resolve.service';

const activityAreaRoute: Routes = [
  {
    path: '',
    component: ActivityAreaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActivityAreaDetailComponent,
    resolve: {
      activityArea: ActivityAreaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActivityAreaUpdateComponent,
    resolve: {
      activityArea: ActivityAreaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActivityAreaUpdateComponent,
    resolve: {
      activityArea: ActivityAreaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(activityAreaRoute)],
  exports: [RouterModule],
})
export class ActivityAreaRoutingModule {}
