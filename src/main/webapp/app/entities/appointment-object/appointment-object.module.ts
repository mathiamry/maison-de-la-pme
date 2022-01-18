import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AppointmentObjectComponent } from './list/appointment-object.component';
import { AppointmentObjectDetailComponent } from './detail/appointment-object-detail.component';
import { AppointmentObjectUpdateComponent } from './update/appointment-object-update.component';
import { AppointmentObjectDeleteDialogComponent } from './delete/appointment-object-delete-dialog.component';
import { AppointmentObjectRoutingModule } from './route/appointment-object-routing.module';

@NgModule({
  imports: [SharedModule, AppointmentObjectRoutingModule],
  declarations: [
    AppointmentObjectComponent,
    AppointmentObjectDetailComponent,
    AppointmentObjectUpdateComponent,
    AppointmentObjectDeleteDialogComponent,
  ],
  entryComponents: [AppointmentObjectDeleteDialogComponent],
})
export class AppointmentObjectModule {}
