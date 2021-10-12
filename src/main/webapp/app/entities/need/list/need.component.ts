import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { INeed } from '../need.model';
import { NeedService } from '../service/need.service';
import { NeedDeleteDialogComponent } from '../delete/need-delete-dialog.component';

@Component({
  selector: 'jhi-need',
  templateUrl: './need.component.html',
})
export class NeedComponent implements OnInit {
  needs?: INeed[];
  isLoading = false;

  constructor(protected needService: NeedService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.needService.query().subscribe(
      (res: HttpResponse<INeed[]>) => {
        this.isLoading = false;
        this.needs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: INeed): number {
    return item.id!;
  }

  delete(need: INeed): void {
    const modalRef = this.modalService.open(NeedDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.need = need;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
