import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INeed } from '../need.model';

@Component({
  selector: 'jhi-need-detail',
  templateUrl: './need-detail.component.html',
})
export class NeedDetailComponent implements OnInit {
  need: INeed | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ need }) => {
      this.need = need;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
