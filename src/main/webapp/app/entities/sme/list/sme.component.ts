import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISme } from '../sme.model';
import { SmeService } from '../service/sme.service';
import { SmeDeleteDialogComponent } from '../delete/sme-delete-dialog.component';

@Component({
  selector: 'jhi-sme',
  templateUrl: './sme.component.html',
})
export class SmeComponent implements OnInit {
  smes?: ISme[];
  isLoading = false;

  constructor(protected smeService: SmeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.smeService.query().subscribe(
      (res: HttpResponse<ISme[]>) => {
        this.isLoading = false;
        this.smes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISme): number {
    return item.id!;
  }

  delete(sme: ISme): void {
    const modalRef = this.modalService.open(SmeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sme = sme;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
