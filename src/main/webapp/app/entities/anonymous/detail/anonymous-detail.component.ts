import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAnonymous } from '../anonymous.model';

@Component({
  selector: 'jhi-anonymous-detail',
  templateUrl: './anonymous-detail.component.html',
})
export class AnonymousDetailComponent implements OnInit {
  anonymous: IAnonymous | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ anonymous }) => {
      this.anonymous = anonymous;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
