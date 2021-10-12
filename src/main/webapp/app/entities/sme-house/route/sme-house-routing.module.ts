import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SMEHouseComponent } from '../list/sme-house.component';
import { SMEHouseDetailComponent } from '../detail/sme-house-detail.component';
import { SMEHouseUpdateComponent } from '../update/sme-house-update.component';
import { SMEHouseRoutingResolveService } from './sme-house-routing-resolve.service';

const sMEHouseRoute: Routes = [
  {
    path: '',
    component: SMEHouseComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SMEHouseDetailComponent,
    resolve: {
      sMEHouse: SMEHouseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SMEHouseUpdateComponent,
    resolve: {
      sMEHouse: SMEHouseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SMEHouseUpdateComponent,
    resolve: {
      sMEHouse: SMEHouseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sMEHouseRoute)],
  exports: [RouterModule],
})
export class SMEHouseRoutingModule {}
