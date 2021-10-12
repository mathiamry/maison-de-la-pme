import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PartnerRepresentativeComponent } from './list/partner-representative.component';
import { PartnerRepresentativeDetailComponent } from './detail/partner-representative-detail.component';
import { PartnerRepresentativeUpdateComponent } from './update/partner-representative-update.component';
import { PartnerRepresentativeDeleteDialogComponent } from './delete/partner-representative-delete-dialog.component';
import { PartnerRepresentativeRoutingModule } from './route/partner-representative-routing.module';

@NgModule({
  imports: [SharedModule, PartnerRepresentativeRoutingModule],
  declarations: [
    PartnerRepresentativeComponent,
    PartnerRepresentativeDetailComponent,
    PartnerRepresentativeUpdateComponent,
    PartnerRepresentativeDeleteDialogComponent,
  ],
  entryComponents: [PartnerRepresentativeDeleteDialogComponent],
})
export class PartnerRepresentativeModule {}
