import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActivityAreaComponent } from './list/activity-area.component';
import { ActivityAreaDetailComponent } from './detail/activity-area-detail.component';
import { ActivityAreaUpdateComponent } from './update/activity-area-update.component';
import { ActivityAreaDeleteDialogComponent } from './delete/activity-area-delete-dialog.component';
import { ActivityAreaRoutingModule } from './route/activity-area-routing.module';

@NgModule({
  imports: [SharedModule, ActivityAreaRoutingModule],
  declarations: [ActivityAreaComponent, ActivityAreaDetailComponent, ActivityAreaUpdateComponent, ActivityAreaDeleteDialogComponent],
  entryComponents: [ActivityAreaDeleteDialogComponent],
})
export class ActivityAreaModule {}
