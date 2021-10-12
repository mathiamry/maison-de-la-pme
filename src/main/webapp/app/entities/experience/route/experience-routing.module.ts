import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExperienceComponent } from '../list/experience.component';
import { ExperienceDetailComponent } from '../detail/experience-detail.component';
import { ExperienceUpdateComponent } from '../update/experience-update.component';
import { ExperienceRoutingResolveService } from './experience-routing-resolve.service';

const experienceRoute: Routes = [
  {
    path: '',
    component: ExperienceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExperienceDetailComponent,
    resolve: {
      experience: ExperienceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExperienceUpdateComponent,
    resolve: {
      experience: ExperienceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExperienceUpdateComponent,
    resolve: {
      experience: ExperienceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(experienceRoute)],
  exports: [RouterModule],
})
export class ExperienceRoutingModule {}
