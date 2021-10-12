import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITender } from '../tender.model';
import { TenderService } from '../service/tender.service';
import { TenderDeleteDialogComponent } from '../delete/tender-delete-dialog.component';

@Component({
  selector: 'jhi-tender',
  templateUrl: './tender.component.html',
})
export class TenderComponent implements OnInit {
  tenders?: ITender[];
  isLoading = false;

  constructor(protected tenderService: TenderService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.tenderService.query().subscribe(
      (res: HttpResponse<ITender[]>) => {
        this.isLoading = false;
        this.tenders = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITender): number {
    return item.id!;
  }

  delete(tender: ITender): void {
    const modalRef = this.modalService.open(TenderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tender = tender;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
