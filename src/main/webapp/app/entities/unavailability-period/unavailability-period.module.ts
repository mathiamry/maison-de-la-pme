import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UnavailabilityPeriodComponent } from './list/unavailability-period.component';
import { UnavailabilityPeriodDetailComponent } from './detail/unavailability-period-detail.component';
import { UnavailabilityPeriodUpdateComponent } from './update/unavailability-period-update.component';
import { UnavailabilityPeriodDeleteDialogComponent } from './delete/unavailability-period-delete-dialog.component';
import { UnavailabilityPeriodRoutingModule } from './route/unavailability-period-routing.module';

@NgModule({
  imports: [SharedModule, UnavailabilityPeriodRoutingModule],
  declarations: [
    UnavailabilityPeriodComponent,
    UnavailabilityPeriodDetailComponent,
    UnavailabilityPeriodUpdateComponent,
    UnavailabilityPeriodDeleteDialogComponent,
  ],
  entryComponents: [UnavailabilityPeriodDeleteDialogComponent],
})
export class UnavailabilityPeriodModule {}
