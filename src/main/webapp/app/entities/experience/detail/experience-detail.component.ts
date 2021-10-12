import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExperience } from '../experience.model';

@Component({
  selector: 'jhi-experience-detail',
  templateUrl: './experience-detail.component.html',
})
export class ExperienceDetailComponent implements OnInit {
  experience: IExperience | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ experience }) => {
      this.experience = experience;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
