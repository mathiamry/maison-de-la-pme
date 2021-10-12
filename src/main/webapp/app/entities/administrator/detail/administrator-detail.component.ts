import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdministrator } from '../administrator.model';

@Component({
  selector: 'jhi-administrator-detail',
  templateUrl: './administrator-detail.component.html',
})
export class AdministratorDetailComponent implements OnInit {
  administrator: IAdministrator | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ administrator }) => {
      this.administrator = administrator;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
