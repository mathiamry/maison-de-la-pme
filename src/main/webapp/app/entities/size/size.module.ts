import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SizeComponent } from './list/size.component';
import { SizeDetailComponent } from './detail/size-detail.component';
import { SizeUpdateComponent } from './update/size-update.component';
import { SizeDeleteDialogComponent } from './delete/size-delete-dialog.component';
import { SizeRoutingModule } from './route/size-routing.module';

@NgModule({
  imports: [SharedModule, SizeRoutingModule],
  declarations: [SizeComponent, SizeDetailComponent, SizeUpdateComponent, SizeDeleteDialogComponent],
  entryComponents: [SizeDeleteDialogComponent],
})
export class SizeModule {}
