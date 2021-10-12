import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISMEHouse } from '../sme-house.model';

@Component({
  selector: 'jhi-sme-house-detail',
  templateUrl: './sme-house-detail.component.html',
})
export class SMEHouseDetailComponent implements OnInit {
  sMEHouse: ISMEHouse | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sMEHouse }) => {
      this.sMEHouse = sMEHouse;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
