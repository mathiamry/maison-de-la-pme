import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TenderComponent } from '../list/tender.component';
import { TenderDetailComponent } from '../detail/tender-detail.component';
import { TenderUpdateComponent } from '../update/tender-update.component';
import { TenderRoutingResolveService } from './tender-routing-resolve.service';

const tenderRoute: Routes = [
  {
    path: '',
    component: TenderComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TenderDetailComponent,
    resolve: {
      tender: TenderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TenderUpdateComponent,
    resolve: {
      tender: TenderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TenderUpdateComponent,
    resolve: {
      tender: TenderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tenderRoute)],
  exports: [RouterModule],
})
export class TenderRoutingModule {}
