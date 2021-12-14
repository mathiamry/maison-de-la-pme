jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FileService } from '../service/file.service';
import { IFile, File } from '../file.model';
import { ITender } from 'app/entities/tender/tender.model';
import { TenderService } from 'app/entities/tender/service/tender.service';
import { ISme } from 'app/entities/sme/sme.model';
import { SmeService } from 'app/entities/sme/service/sme.service';

import { FileUpdateComponent } from './file-update.component';

describe('File Management Update Component', () => {
  let comp: FileUpdateComponent;
  let fixture: ComponentFixture<FileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fileService: FileService;
  let tenderService: TenderService;
  let smeService: SmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FileUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(FileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fileService = TestBed.inject(FileService);
    tenderService = TestBed.inject(TenderService);
    smeService = TestBed.inject(SmeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Tender query and add missing value', () => {
      const file: IFile = { id: 456 };
      const tender: ITender = { id: 58239 };
      file.tender = tender;

      const tenderCollection: ITender[] = [{ id: 4421 }];
      jest.spyOn(tenderService, 'query').mockReturnValue(of(new HttpResponse({ body: tenderCollection })));
      const additionalTenders = [tender];
      const expectedCollection: ITender[] = [...additionalTenders, ...tenderCollection];
      jest.spyOn(tenderService, 'addTenderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ file });
      comp.ngOnInit();

      expect(tenderService.query).toHaveBeenCalled();
      expect(tenderService.addTenderToCollectionIfMissing).toHaveBeenCalledWith(tenderCollection, ...additionalTenders);
      expect(comp.tendersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Sme query and add missing value', () => {
      const file: IFile = { id: 456 };
      const sme: ISme = { id: 51764 };
      file.sme = sme;

      const smeCollection: ISme[] = [{ id: 40086 }];
      jest.spyOn(smeService, 'query').mockReturnValue(of(new HttpResponse({ body: smeCollection })));
      const additionalSmes = [sme];
      const expectedCollection: ISme[] = [...additionalSmes, ...smeCollection];
      jest.spyOn(smeService, 'addSmeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ file });
      comp.ngOnInit();

      expect(smeService.query).toHaveBeenCalled();
      expect(smeService.addSmeToCollectionIfMissing).toHaveBeenCalledWith(smeCollection, ...additionalSmes);
      expect(comp.smesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const file: IFile = { id: 456 };
      const tender: ITender = { id: 51214 };
      file.tender = tender;
      const sme: ISme = { id: 20465 };
      file.sme = sme;

      activatedRoute.data = of({ file });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(file));
      expect(comp.tendersSharedCollection).toContain(tender);
      expect(comp.smesSharedCollection).toContain(sme);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<File>>();
      const file = { id: 123 };
      jest.spyOn(fileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ file });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: file }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(fileService.update).toHaveBeenCalledWith(file);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<File>>();
      const file = new File();
      jest.spyOn(fileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ file });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: file }));
      saveSubject.complete();

      // THEN
      expect(fileService.create).toHaveBeenCalledWith(file);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<File>>();
      const file = { id: 123 };
      jest.spyOn(fileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ file });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fileService.update).toHaveBeenCalledWith(file);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTenderById', () => {
      it('Should return tracked Tender primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTenderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSmeById', () => {
      it('Should return tracked Sme primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSmeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
