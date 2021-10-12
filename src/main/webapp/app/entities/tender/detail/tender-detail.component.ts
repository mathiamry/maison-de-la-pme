import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITender } from '../tender.model';

@Component({
  selector: 'jhi-tender-detail',
  templateUrl: './tender-detail.component.html',
})
export class TenderDetailComponent implements OnInit {
  tender: ITender | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tender }) => {
      this.tender = tender;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
