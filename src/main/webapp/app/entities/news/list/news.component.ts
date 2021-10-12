import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { INews } from '../news.model';
import { NewsService } from '../service/news.service';
import { NewsDeleteDialogComponent } from '../delete/news-delete-dialog.component';

@Component({
  selector: 'jhi-news',
  templateUrl: './news.component.html',
})
export class NewsComponent implements OnInit {
  news?: INews[];
  isLoading = false;

  constructor(protected newsService: NewsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.newsService.query().subscribe(
      (res: HttpResponse<INews[]>) => {
        this.isLoading = false;
        this.news = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: INews): number {
    return item.id!;
  }

  delete(news: INews): void {
    const modalRef = this.modalService.open(NewsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.news = news;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
