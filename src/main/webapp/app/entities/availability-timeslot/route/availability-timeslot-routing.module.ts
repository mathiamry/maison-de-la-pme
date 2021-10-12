import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AvailabilityTimeslotComponent } from '../list/availability-timeslot.component';
import { AvailabilityTimeslotDetailComponent } from '../detail/availability-timeslot-detail.component';
import { AvailabilityTimeslotUpdateComponent } from '../update/availability-timeslot-update.component';
import { AvailabilityTimeslotRoutingResolveService } from './availability-timeslot-routing-resolve.service';

const availabilityTimeslotRoute: Routes = [
  {
    path: '',
    component: AvailabilityTimeslotComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AvailabilityTimeslotDetailComponent,
    resolve: {
      availabilityTimeslot: AvailabilityTimeslotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AvailabilityTimeslotUpdateComponent,
    resolve: {
      availabilityTimeslot: AvailabilityTimeslotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AvailabilityTimeslotUpdateComponent,
    resolve: {
      availabilityTimeslot: AvailabilityTimeslotRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(availabilityTimeslotRoute)],
  exports: [RouterModule],
})
export class AvailabilityTimeslotRoutingModule {}
