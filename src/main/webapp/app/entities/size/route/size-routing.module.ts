import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SizeComponent } from '../list/size.component';
import { SizeDetailComponent } from '../detail/size-detail.component';
import { SizeUpdateComponent } from '../update/size-update.component';
import { SizeRoutingResolveService } from './size-routing-resolve.service';

const sizeRoute: Routes = [
  {
    path: '',
    component: SizeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SizeDetailComponent,
    resolve: {
      size: SizeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SizeUpdateComponent,
    resolve: {
      size: SizeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SizeUpdateComponent,
    resolve: {
      size: SizeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sizeRoute)],
  exports: [RouterModule],
})
export class SizeRoutingModule {}
