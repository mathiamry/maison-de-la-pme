import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PartnerRepresentativeComponent } from '../list/partner-representative.component';
import { PartnerRepresentativeDetailComponent } from '../detail/partner-representative-detail.component';
import { PartnerRepresentativeUpdateComponent } from '../update/partner-representative-update.component';
import { PartnerRepresentativeRoutingResolveService } from './partner-representative-routing-resolve.service';

const partnerRepresentativeRoute: Routes = [
  {
    path: '',
    component: PartnerRepresentativeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartnerRepresentativeDetailComponent,
    resolve: {
      partnerRepresentative: PartnerRepresentativeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartnerRepresentativeUpdateComponent,
    resolve: {
      partnerRepresentative: PartnerRepresentativeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartnerRepresentativeUpdateComponent,
    resolve: {
      partnerRepresentative: PartnerRepresentativeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(partnerRepresentativeRoute)],
  exports: [RouterModule],
})
export class PartnerRepresentativeRoutingModule {}
