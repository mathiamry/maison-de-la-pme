import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISmeRepresentative } from '../sme-representative.model';
import { SmeRepresentativeService } from '../service/sme-representative.service';
import { SmeRepresentativeDeleteDialogComponent } from '../delete/sme-representative-delete-dialog.component';

@Component({
  selector: 'jhi-sme-representative',
  templateUrl: './sme-representative.component.html',
})
export class SmeRepresentativeComponent implements OnInit {
  smeRepresentatives?: ISmeRepresentative[];
  isLoading = false;

  constructor(protected smeRepresentativeService: SmeRepresentativeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.smeRepresentativeService.query().subscribe(
      (res: HttpResponse<ISmeRepresentative[]>) => {
        this.isLoading = false;
        this.smeRepresentatives = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISmeRepresentative): number {
    return item.id!;
  }

  delete(smeRepresentative: ISmeRepresentative): void {
    const modalRef = this.modalService.open(SmeRepresentativeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.smeRepresentative = smeRepresentative;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
