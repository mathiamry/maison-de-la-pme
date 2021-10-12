import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INews } from '../news.model';
import { NewsService } from '../service/news.service';

@Component({
  templateUrl: './news-delete-dialog.component.html',
})
export class NewsDeleteDialogComponent {
  news?: INews;

  constructor(protected newsService: NewsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.newsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
