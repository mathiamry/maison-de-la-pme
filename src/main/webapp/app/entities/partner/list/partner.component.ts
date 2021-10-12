import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPartner } from '../partner.model';
import { PartnerService } from '../service/partner.service';
import { PartnerDeleteDialogComponent } from '../delete/partner-delete-dialog.component';

@Component({
  selector: 'jhi-partner',
  templateUrl: './partner.component.html',
})
export class PartnerComponent implements OnInit {
  partners?: IPartner[];
  isLoading = false;

  constructor(protected partnerService: PartnerService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.partnerService.query().subscribe(
      (res: HttpResponse<IPartner[]>) => {
        this.isLoading = false;
        this.partners = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPartner): number {
    return item.id!;
  }

  delete(partner: IPartner): void {
    const modalRef = this.modalService.open(PartnerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.partner = partner;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
