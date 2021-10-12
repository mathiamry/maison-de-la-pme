import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AnonymousComponent } from './list/anonymous.component';
import { AnonymousDetailComponent } from './detail/anonymous-detail.component';
import { AnonymousUpdateComponent } from './update/anonymous-update.component';
import { AnonymousDeleteDialogComponent } from './delete/anonymous-delete-dialog.component';
import { AnonymousRoutingModule } from './route/anonymous-routing.module';

@NgModule({
  imports: [SharedModule, AnonymousRoutingModule],
  declarations: [AnonymousComponent, AnonymousDetailComponent, AnonymousUpdateComponent, AnonymousDeleteDialogComponent],
  entryComponents: [AnonymousDeleteDialogComponent],
})
export class AnonymousModule {}
