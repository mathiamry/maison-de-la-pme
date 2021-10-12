import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SmeRepresentativeComponent } from './list/sme-representative.component';
import { SmeRepresentativeDetailComponent } from './detail/sme-representative-detail.component';
import { SmeRepresentativeUpdateComponent } from './update/sme-representative-update.component';
import { SmeRepresentativeDeleteDialogComponent } from './delete/sme-representative-delete-dialog.component';
import { SmeRepresentativeRoutingModule } from './route/sme-representative-routing.module';

@NgModule({
  imports: [SharedModule, SmeRepresentativeRoutingModule],
  declarations: [
    SmeRepresentativeComponent,
    SmeRepresentativeDetailComponent,
    SmeRepresentativeUpdateComponent,
    SmeRepresentativeDeleteDialogComponent,
  ],
  entryComponents: [SmeRepresentativeDeleteDialogComponent],
})
export class SmeRepresentativeModule {}
