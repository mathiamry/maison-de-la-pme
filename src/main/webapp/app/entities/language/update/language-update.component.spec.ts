import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LanguageService } from '../service/language.service';
import { ILanguage, Language } from '../language.model';

import { LanguageUpdateComponent } from './language-update.component';

describe('Language Management Update Component', () => {
  let comp: LanguageUpdateComponent;
  let fixture: ComponentFixture<LanguageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let languageService: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LanguageUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LanguageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LanguageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    languageService = TestBed.inject(LanguageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const language: ILanguage = { id: 456 };

      activatedRoute.data = of({ language });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(language));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Language>>();
      const language = { id: 123 };
      jest.spyOn(languageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ language });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: language }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(languageService.update).toHaveBeenCalledWith(language);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Language>>();
      const language = new Language();
      jest.spyOn(languageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ language });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: language }));
      saveSubject.complete();

      // THEN
      expect(languageService.create).toHaveBeenCalledWith(language);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Language>>();
      const language = { id: 123 };
      jest.spyOn(languageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ language });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(languageService.update).toHaveBeenCalledWith(language);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
