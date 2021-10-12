import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SmeComponent } from '../list/sme.component';
import { SmeDetailComponent } from '../detail/sme-detail.component';
import { SmeUpdateComponent } from '../update/sme-update.component';
import { SmeRoutingResolveService } from './sme-routing-resolve.service';

const smeRoute: Routes = [
  {
    path: '',
    component: SmeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SmeDetailComponent,
    resolve: {
      sme: SmeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SmeUpdateComponent,
    resolve: {
      sme: SmeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SmeUpdateComponent,
    resolve: {
      sme: SmeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(smeRoute)],
  exports: [RouterModule],
})
export class SmeRoutingModule {}
