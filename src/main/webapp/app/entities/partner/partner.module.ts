import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PartnerComponent } from './list/partner.component';
import { PartnerDetailComponent } from './detail/partner-detail.component';
import { PartnerUpdateComponent } from './update/partner-update.component';
import { PartnerDeleteDialogComponent } from './delete/partner-delete-dialog.component';
import { PartnerRoutingModule } from './route/partner-routing.module';

@NgModule({
  imports: [SharedModule, PartnerRoutingModule],
  declarations: [PartnerComponent, PartnerDetailComponent, PartnerUpdateComponent, PartnerDeleteDialogComponent],
  entryComponents: [PartnerDeleteDialogComponent],
})
export class PartnerModule {}
