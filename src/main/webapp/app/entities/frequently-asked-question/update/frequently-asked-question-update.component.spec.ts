jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FrequentlyAskedQuestionService } from '../service/frequently-asked-question.service';
import { IFrequentlyAskedQuestion, FrequentlyAskedQuestion } from '../frequently-asked-question.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { FrequentlyAskedQuestionUpdateComponent } from './frequently-asked-question-update.component';

describe('FrequentlyAskedQuestion Management Update Component', () => {
  let comp: FrequentlyAskedQuestionUpdateComponent;
  let fixture: ComponentFixture<FrequentlyAskedQuestionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let frequentlyAskedQuestionService: FrequentlyAskedQuestionService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FrequentlyAskedQuestionUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(FrequentlyAskedQuestionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FrequentlyAskedQuestionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    frequentlyAskedQuestionService = TestBed.inject(FrequentlyAskedQuestionService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const frequentlyAskedQuestion: IFrequentlyAskedQuestion = { id: 456 };
      const author: IUser = { id: 25372 };
      frequentlyAskedQuestion.author = author;

      const userCollection: IUser[] = [{ id: 63790 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [author];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ frequentlyAskedQuestion });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const frequentlyAskedQuestion: IFrequentlyAskedQuestion = { id: 456 };
      const author: IUser = { id: 61306 };
      frequentlyAskedQuestion.author = author;

      activatedRoute.data = of({ frequentlyAskedQuestion });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(frequentlyAskedQuestion));
      expect(comp.usersSharedCollection).toContain(author);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FrequentlyAskedQuestion>>();
      const frequentlyAskedQuestion = { id: 123 };
      jest.spyOn(frequentlyAskedQuestionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ frequentlyAskedQuestion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: frequentlyAskedQuestion }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(frequentlyAskedQuestionService.update).toHaveBeenCalledWith(frequentlyAskedQuestion);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FrequentlyAskedQuestion>>();
      const frequentlyAskedQuestion = new FrequentlyAskedQuestion();
      jest.spyOn(frequentlyAskedQuestionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ frequentlyAskedQuestion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: frequentlyAskedQuestion }));
      saveSubject.complete();

      // THEN
      expect(frequentlyAskedQuestionService.create).toHaveBeenCalledWith(frequentlyAskedQuestion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FrequentlyAskedQuestion>>();
      const frequentlyAskedQuestion = { id: 123 };
      jest.spyOn(frequentlyAskedQuestionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ frequentlyAskedQuestion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(frequentlyAskedQuestionService.update).toHaveBeenCalledWith(frequentlyAskedQuestion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
