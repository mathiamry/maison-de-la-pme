import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SmeComponent } from './list/sme.component';
import { SmeDetailComponent } from './detail/sme-detail.component';
import { SmeUpdateComponent } from './update/sme-update.component';
import { SmeDeleteDialogComponent } from './delete/sme-delete-dialog.component';
import { SmeRoutingModule } from './route/sme-routing.module';

@NgModule({
  imports: [SharedModule, SmeRoutingModule],
  declarations: [SmeComponent, SmeDetailComponent, SmeUpdateComponent, SmeDeleteDialogComponent],
  entryComponents: [SmeDeleteDialogComponent],
})
export class SmeModule {}
