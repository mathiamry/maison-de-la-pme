import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AppointmentObjectComponent } from '../list/appointment-object.component';
import { AppointmentObjectDetailComponent } from '../detail/appointment-object-detail.component';
import { AppointmentObjectUpdateComponent } from '../update/appointment-object-update.component';
import { AppointmentObjectRoutingResolveService } from './appointment-object-routing-resolve.service';

const appointmentObjectRoute: Routes = [
  {
    path: '',
    component: AppointmentObjectComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AppointmentObjectDetailComponent,
    resolve: {
      appointmentObject: AppointmentObjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AppointmentObjectUpdateComponent,
    resolve: {
      appointmentObject: AppointmentObjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AppointmentObjectUpdateComponent,
    resolve: {
      appointmentObject: AppointmentObjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appointmentObjectRoute)],
  exports: [RouterModule],
})
export class AppointmentObjectRoutingModule {}
