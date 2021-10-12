import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FrequentlyAskedQuestionComponent } from './list/frequently-asked-question.component';
import { FrequentlyAskedQuestionDetailComponent } from './detail/frequently-asked-question-detail.component';
import { FrequentlyAskedQuestionUpdateComponent } from './update/frequently-asked-question-update.component';
import { FrequentlyAskedQuestionDeleteDialogComponent } from './delete/frequently-asked-question-delete-dialog.component';
import { FrequentlyAskedQuestionRoutingModule } from './route/frequently-asked-question-routing.module';

@NgModule({
  imports: [SharedModule, FrequentlyAskedQuestionRoutingModule],
  declarations: [
    FrequentlyAskedQuestionComponent,
    FrequentlyAskedQuestionDetailComponent,
    FrequentlyAskedQuestionUpdateComponent,
    FrequentlyAskedQuestionDeleteDialogComponent,
  ],
  entryComponents: [FrequentlyAskedQuestionDeleteDialogComponent],
})
export class FrequentlyAskedQuestionModule {}
