import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISize } from '../size.model';
import { SizeService } from '../service/size.service';
import { SizeDeleteDialogComponent } from '../delete/size-delete-dialog.component';

@Component({
  selector: 'jhi-size',
  templateUrl: './size.component.html',
})
export class SizeComponent implements OnInit {
  sizes?: ISize[];
  isLoading = false;

  constructor(protected sizeService: SizeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.sizeService.query().subscribe(
      (res: HttpResponse<ISize[]>) => {
        this.isLoading = false;
        this.sizes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISize): number {
    return item.id!;
  }

  delete(size: ISize): void {
    const modalRef = this.modalService.open(SizeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.size = size;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
