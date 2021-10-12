import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivityArea } from '../activity-area.model';
import { ActivityAreaService } from '../service/activity-area.service';
import { ActivityAreaDeleteDialogComponent } from '../delete/activity-area-delete-dialog.component';

@Component({
  selector: 'jhi-activity-area',
  templateUrl: './activity-area.component.html',
})
export class ActivityAreaComponent implements OnInit {
  activityAreas?: IActivityArea[];
  isLoading = false;

  constructor(protected activityAreaService: ActivityAreaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.activityAreaService.query().subscribe(
      (res: HttpResponse<IActivityArea[]>) => {
        this.isLoading = false;
        this.activityAreas = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IActivityArea): number {
    return item.id!;
  }

  delete(activityArea: IActivityArea): void {
    const modalRef = this.modalService.open(ActivityAreaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.activityArea = activityArea;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
