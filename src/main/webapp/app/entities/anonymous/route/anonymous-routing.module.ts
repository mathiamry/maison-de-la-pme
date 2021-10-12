import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AnonymousComponent } from '../list/anonymous.component';
import { AnonymousDetailComponent } from '../detail/anonymous-detail.component';
import { AnonymousUpdateComponent } from '../update/anonymous-update.component';
import { AnonymousRoutingResolveService } from './anonymous-routing-resolve.service';

const anonymousRoute: Routes = [
  {
    path: '',
    component: AnonymousComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AnonymousDetailComponent,
    resolve: {
      anonymous: AnonymousRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AnonymousUpdateComponent,
    resolve: {
      anonymous: AnonymousRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AnonymousUpdateComponent,
    resolve: {
      anonymous: AnonymousRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(anonymousRoute)],
  exports: [RouterModule],
})
export class AnonymousRoutingModule {}
