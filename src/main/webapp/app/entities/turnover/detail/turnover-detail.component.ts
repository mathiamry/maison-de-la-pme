import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITurnover } from '../turnover.model';

@Component({
  selector: 'jhi-turnover-detail',
  templateUrl: './turnover-detail.component.html',
})
export class TurnoverDetailComponent implements OnInit {
  turnover: ITurnover | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ turnover }) => {
      this.turnover = turnover;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
