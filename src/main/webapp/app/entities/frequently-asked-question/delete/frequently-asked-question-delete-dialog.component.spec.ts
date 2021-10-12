jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FrequentlyAskedQuestionService } from '../service/frequently-asked-question.service';

import { FrequentlyAskedQuestionDeleteDialogComponent } from './frequently-asked-question-delete-dialog.component';

describe('Component Tests', () => {
  describe('FrequentlyAskedQuestion Management Delete Component', () => {
    let comp: FrequentlyAskedQuestionDeleteDialogComponent;
    let fixture: ComponentFixture<FrequentlyAskedQuestionDeleteDialogComponent>;
    let service: FrequentlyAskedQuestionService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FrequentlyAskedQuestionDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(FrequentlyAskedQuestionDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FrequentlyAskedQuestionDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FrequentlyAskedQuestionService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({})));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        jest.spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
