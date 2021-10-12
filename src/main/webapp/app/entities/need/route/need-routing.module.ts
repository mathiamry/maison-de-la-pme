import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NeedComponent } from '../list/need.component';
import { NeedDetailComponent } from '../detail/need-detail.component';
import { NeedUpdateComponent } from '../update/need-update.component';
import { NeedRoutingResolveService } from './need-routing-resolve.service';

const needRoute: Routes = [
  {
    path: '',
    component: NeedComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NeedDetailComponent,
    resolve: {
      need: NeedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NeedUpdateComponent,
    resolve: {
      need: NeedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NeedUpdateComponent,
    resolve: {
      need: NeedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(needRoute)],
  exports: [RouterModule],
})
export class NeedRoutingModule {}
