import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITurnover } from '../turnover.model';
import { TurnoverService } from '../service/turnover.service';
import { TurnoverDeleteDialogComponent } from '../delete/turnover-delete-dialog.component';

@Component({
  selector: 'jhi-turnover',
  templateUrl: './turnover.component.html',
})
export class TurnoverComponent implements OnInit {
  turnovers?: ITurnover[];
  isLoading = false;

  constructor(protected turnoverService: TurnoverService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.turnoverService.query().subscribe(
      (res: HttpResponse<ITurnover[]>) => {
        this.isLoading = false;
        this.turnovers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITurnover): number {
    return item.id!;
  }

  delete(turnover: ITurnover): void {
    const modalRef = this.modalService.open(TurnoverDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.turnover = turnover;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
