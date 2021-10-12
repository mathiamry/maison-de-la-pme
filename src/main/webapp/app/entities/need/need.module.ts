import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NeedComponent } from './list/need.component';
import { NeedDetailComponent } from './detail/need-detail.component';
import { NeedUpdateComponent } from './update/need-update.component';
import { NeedDeleteDialogComponent } from './delete/need-delete-dialog.component';
import { NeedRoutingModule } from './route/need-routing.module';

@NgModule({
  imports: [SharedModule, NeedRoutingModule],
  declarations: [NeedComponent, NeedDetailComponent, NeedUpdateComponent, NeedDeleteDialogComponent],
  entryComponents: [NeedDeleteDialogComponent],
})
export class NeedModule {}
