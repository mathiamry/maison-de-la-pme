import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PartnerComponent } from '../list/partner.component';
import { PartnerDetailComponent } from '../detail/partner-detail.component';
import { PartnerUpdateComponent } from '../update/partner-update.component';
import { PartnerRoutingResolveService } from './partner-routing-resolve.service';

const partnerRoute: Routes = [
  {
    path: '',
    component: PartnerComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartnerDetailComponent,
    resolve: {
      partner: PartnerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartnerUpdateComponent,
    resolve: {
      partner: PartnerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartnerUpdateComponent,
    resolve: {
      partner: PartnerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(partnerRoute)],
  exports: [RouterModule],
})
export class PartnerRoutingModule {}
