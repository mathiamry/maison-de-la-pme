import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISMEHouse } from '../sme-house.model';
import { SMEHouseService } from '../service/sme-house.service';
import { SMEHouseDeleteDialogComponent } from '../delete/sme-house-delete-dialog.component';

@Component({
  selector: 'jhi-sme-house',
  templateUrl: './sme-house.component.html',
})
export class SMEHouseComponent implements OnInit {
  sMEHouses?: ISMEHouse[];
  isLoading = false;

  constructor(protected sMEHouseService: SMEHouseService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.sMEHouseService.query().subscribe(
      (res: HttpResponse<ISMEHouse[]>) => {
        this.isLoading = false;
        this.sMEHouses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISMEHouse): number {
    return item.id!;
  }

  delete(sMEHouse: ISMEHouse): void {
    const modalRef = this.modalService.open(SMEHouseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sMEHouse = sMEHouse;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
