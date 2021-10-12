import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExperience } from '../experience.model';
import { ExperienceService } from '../service/experience.service';

@Component({
  templateUrl: './experience-delete-dialog.component.html',
})
export class ExperienceDeleteDialogComponent {
  experience?: IExperience;

  constructor(protected experienceService: ExperienceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.experienceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
