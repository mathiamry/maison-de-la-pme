import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IHistory } from '../history.model';
import { HistoryService } from '../service/history.service';
import { HistoryDeleteDialogComponent } from '../delete/history-delete-dialog.component';

@Component({
  selector: 'jhi-history',
  templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
  histories?: IHistory[];
  isLoading = false;

  constructor(protected historyService: HistoryService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.historyService.query().subscribe(
      (res: HttpResponse<IHistory[]>) => {
        this.isLoading = false;
        this.histories = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IHistory): number {
    return item.id!;
  }

  delete(history: IHistory): void {
    const modalRef = this.modalService.open(HistoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.history = history;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
