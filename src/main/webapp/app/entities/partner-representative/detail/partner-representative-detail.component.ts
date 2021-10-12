import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPartnerRepresentative } from '../partner-representative.model';

@Component({
  selector: 'jhi-partner-representative-detail',
  templateUrl: './partner-representative-detail.component.html',
})
export class PartnerRepresentativeDetailComponent implements OnInit {
  partnerRepresentative: IPartnerRepresentative | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partnerRepresentative }) => {
      this.partnerRepresentative = partnerRepresentative;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
