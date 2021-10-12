import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TenderComponent } from './list/tender.component';
import { TenderDetailComponent } from './detail/tender-detail.component';
import { TenderUpdateComponent } from './update/tender-update.component';
import { TenderDeleteDialogComponent } from './delete/tender-delete-dialog.component';
import { TenderRoutingModule } from './route/tender-routing.module';

@NgModule({
  imports: [SharedModule, TenderRoutingModule],
  declarations: [TenderComponent, TenderDetailComponent, TenderUpdateComponent, TenderDeleteDialogComponent],
  entryComponents: [TenderDeleteDialogComponent],
})
export class TenderModule {}
