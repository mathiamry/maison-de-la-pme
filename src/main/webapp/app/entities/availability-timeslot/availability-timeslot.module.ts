import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AvailabilityTimeslotComponent } from './list/availability-timeslot.component';
import { AvailabilityTimeslotDetailComponent } from './detail/availability-timeslot-detail.component';
import { AvailabilityTimeslotUpdateComponent } from './update/availability-timeslot-update.component';
import { AvailabilityTimeslotDeleteDialogComponent } from './delete/availability-timeslot-delete-dialog.component';
import { AvailabilityTimeslotRoutingModule } from './route/availability-timeslot-routing.module';

@NgModule({
  imports: [SharedModule, AvailabilityTimeslotRoutingModule],
  declarations: [
    AvailabilityTimeslotComponent,
    AvailabilityTimeslotDetailComponent,
    AvailabilityTimeslotUpdateComponent,
    AvailabilityTimeslotDeleteDialogComponent,
  ],
  entryComponents: [AvailabilityTimeslotDeleteDialogComponent],
})
export class AvailabilityTimeslotModule {}
