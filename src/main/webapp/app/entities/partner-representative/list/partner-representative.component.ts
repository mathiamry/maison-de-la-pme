import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPartnerRepresentative } from '../partner-representative.model';
import { PartnerRepresentativeService } from '../service/partner-representative.service';
import { PartnerRepresentativeDeleteDialogComponent } from '../delete/partner-representative-delete-dialog.component';

@Component({
  selector: 'jhi-partner-representative',
  templateUrl: './partner-representative.component.html',
})
export class PartnerRepresentativeComponent implements OnInit {
  partnerRepresentatives?: IPartnerRepresentative[];
  isLoading = false;

  constructor(protected partnerRepresentativeService: PartnerRepresentativeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.partnerRepresentativeService.query().subscribe(
      (res: HttpResponse<IPartnerRepresentative[]>) => {
        this.isLoading = false;
        this.partnerRepresentatives = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPartnerRepresentative): number {
    return item.id!;
  }

  delete(partnerRepresentative: IPartnerRepresentative): void {
    const modalRef = this.modalService.open(PartnerRepresentativeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.partnerRepresentative = partnerRepresentative;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
