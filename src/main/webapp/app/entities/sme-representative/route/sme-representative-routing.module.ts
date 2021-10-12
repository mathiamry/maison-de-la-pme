import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SmeRepresentativeComponent } from '../list/sme-representative.component';
import { SmeRepresentativeDetailComponent } from '../detail/sme-representative-detail.component';
import { SmeRepresentativeUpdateComponent } from '../update/sme-representative-update.component';
import { SmeRepresentativeRoutingResolveService } from './sme-representative-routing-resolve.service';

const smeRepresentativeRoute: Routes = [
  {
    path: '',
    component: SmeRepresentativeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SmeRepresentativeDetailComponent,
    resolve: {
      smeRepresentative: SmeRepresentativeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SmeRepresentativeUpdateComponent,
    resolve: {
      smeRepresentative: SmeRepresentativeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SmeRepresentativeUpdateComponent,
    resolve: {
      smeRepresentative: SmeRepresentativeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(smeRepresentativeRoute)],
  exports: [RouterModule],
})
export class SmeRepresentativeRoutingModule {}
