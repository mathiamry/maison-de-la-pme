import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISme } from '../sme.model';

@Component({
  selector: 'jhi-sme-detail',
  templateUrl: './sme-detail.component.html',
})
export class SmeDetailComponent implements OnInit {
  sme: ISme | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sme }) => {
      this.sme = sme;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
