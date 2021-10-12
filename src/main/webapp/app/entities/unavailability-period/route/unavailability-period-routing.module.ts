import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UnavailabilityPeriodComponent } from '../list/unavailability-period.component';
import { UnavailabilityPeriodDetailComponent } from '../detail/unavailability-period-detail.component';
import { UnavailabilityPeriodUpdateComponent } from '../update/unavailability-period-update.component';
import { UnavailabilityPeriodRoutingResolveService } from './unavailability-period-routing-resolve.service';

const unavailabilityPeriodRoute: Routes = [
  {
    path: '',
    component: UnavailabilityPeriodComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UnavailabilityPeriodDetailComponent,
    resolve: {
      unavailabilityPeriod: UnavailabilityPeriodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UnavailabilityPeriodUpdateComponent,
    resolve: {
      unavailabilityPeriod: UnavailabilityPeriodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UnavailabilityPeriodUpdateComponent,
    resolve: {
      unavailabilityPeriod: UnavailabilityPeriodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(unavailabilityPeriodRoute)],
  exports: [RouterModule],
})
export class UnavailabilityPeriodRoutingModule {}
