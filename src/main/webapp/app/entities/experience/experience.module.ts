import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExperienceComponent } from './list/experience.component';
import { ExperienceDetailComponent } from './detail/experience-detail.component';
import { ExperienceUpdateComponent } from './update/experience-update.component';
import { ExperienceDeleteDialogComponent } from './delete/experience-delete-dialog.component';
import { ExperienceRoutingModule } from './route/experience-routing.module';

@NgModule({
  imports: [SharedModule, ExperienceRoutingModule],
  declarations: [ExperienceComponent, ExperienceDetailComponent, ExperienceUpdateComponent, ExperienceDeleteDialogComponent],
  entryComponents: [ExperienceDeleteDialogComponent],
})
export class ExperienceModule {}
