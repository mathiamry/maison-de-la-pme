import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TurnoverComponent } from './list/turnover.component';
import { TurnoverDetailComponent } from './detail/turnover-detail.component';
import { TurnoverUpdateComponent } from './update/turnover-update.component';
import { TurnoverDeleteDialogComponent } from './delete/turnover-delete-dialog.component';
import { TurnoverRoutingModule } from './route/turnover-routing.module';

@NgModule({
  imports: [SharedModule, TurnoverRoutingModule],
  declarations: [TurnoverComponent, TurnoverDetailComponent, TurnoverUpdateComponent, TurnoverDeleteDialogComponent],
  entryComponents: [TurnoverDeleteDialogComponent],
})
export class TurnoverModule {}
