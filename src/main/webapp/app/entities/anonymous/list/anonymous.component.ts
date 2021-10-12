import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnonymous } from '../anonymous.model';
import { AnonymousService } from '../service/anonymous.service';
import { AnonymousDeleteDialogComponent } from '../delete/anonymous-delete-dialog.component';

@Component({
  selector: 'jhi-anonymous',
  templateUrl: './anonymous.component.html',
})
export class AnonymousComponent implements OnInit {
  anonymous?: IAnonymous[];
  isLoading = false;

  constructor(protected anonymousService: AnonymousService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.anonymousService.query().subscribe(
      (res: HttpResponse<IAnonymous[]>) => {
        this.isLoading = false;
        this.anonymous = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAnonymous): number {
    return item.id!;
  }

  delete(anonymous: IAnonymous): void {
    const modalRef = this.modalService.open(AnonymousDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.anonymous = anonymous;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
