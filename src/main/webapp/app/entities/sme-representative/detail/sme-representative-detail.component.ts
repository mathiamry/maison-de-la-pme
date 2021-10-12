import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISmeRepresentative } from '../sme-representative.model';

@Component({
  selector: 'jhi-sme-representative-detail',
  templateUrl: './sme-representative-detail.component.html',
})
export class SmeRepresentativeDetailComponent implements OnInit {
  smeRepresentative: ISmeRepresentative | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ smeRepresentative }) => {
      this.smeRepresentative = smeRepresentative;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
