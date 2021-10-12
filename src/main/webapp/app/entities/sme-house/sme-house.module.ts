import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SMEHouseComponent } from './list/sme-house.component';
import { SMEHouseDetailComponent } from './detail/sme-house-detail.component';
import { SMEHouseUpdateComponent } from './update/sme-house-update.component';
import { SMEHouseDeleteDialogComponent } from './delete/sme-house-delete-dialog.component';
import { SMEHouseRoutingModule } from './route/sme-house-routing.module';

@NgModule({
  imports: [SharedModule, SMEHouseRoutingModule],
  declarations: [SMEHouseComponent, SMEHouseDetailComponent, SMEHouseUpdateComponent, SMEHouseDeleteDialogComponent],
  entryComponents: [SMEHouseDeleteDialogComponent],
})
export class SMEHouseModule {}
