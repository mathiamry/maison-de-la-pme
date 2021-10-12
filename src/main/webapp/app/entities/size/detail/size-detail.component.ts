import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISize } from '../size.model';

@Component({
  selector: 'jhi-size-detail',
  templateUrl: './size-detail.component.html',
})
export class SizeDetailComponent implements OnInit {
  size: ISize | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ size }) => {
      this.size = size;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
