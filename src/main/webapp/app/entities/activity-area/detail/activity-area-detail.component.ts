import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActivityArea } from '../activity-area.model';

@Component({
  selector: 'jhi-activity-area-detail',
  templateUrl: './activity-area-detail.component.html',
})
export class ActivityAreaDetailComponent implements OnInit {
  activityArea: IActivityArea | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activityArea }) => {
      this.activityArea = activityArea;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
