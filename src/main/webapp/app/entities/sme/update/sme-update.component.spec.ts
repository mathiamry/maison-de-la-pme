import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SmeService } from '../service/sme.service';
import { ISme, Sme } from '../sme.model';
import { IActivityArea } from 'app/entities/activity-area/activity-area.model';
import { ActivityAreaService } from 'app/entities/activity-area/service/activity-area.service';
import { INeed } from 'app/entities/need/need.model';
import { NeedService } from 'app/entities/need/service/need.service';
import { ISMEHouse } from 'app/entities/sme-house/sme-house.model';
import { SMEHouseService } from 'app/entities/sme-house/service/sme-house.service';
import { ITurnover } from 'app/entities/turnover/turnover.model';
import { TurnoverService } from 'app/entities/turnover/service/turnover.service';
import { IExperience } from 'app/entities/experience/experience.model';
import { ExperienceService } from 'app/entities/experience/service/experience.service';
import { ISize } from 'app/entities/size/size.model';
import { SizeService } from 'app/entities/size/service/size.service';

import { SmeUpdateComponent } from './sme-update.component';

describe('Sme Management Update Component', () => {
  let comp: SmeUpdateComponent;
  let fixture: ComponentFixture<SmeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let smeService: SmeService;
  let activityAreaService: ActivityAreaService;
  let needService: NeedService;
  let sMEHouseService: SMEHouseService;
  let turnoverService: TurnoverService;
  let experienceService: ExperienceService;
  let sizeService: SizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SmeUpdateComponent],
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
      .overrideTemplate(SmeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SmeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    smeService = TestBed.inject(SmeService);
    activityAreaService = TestBed.inject(ActivityAreaService);
    needService = TestBed.inject(NeedService);
    sMEHouseService = TestBed.inject(SMEHouseService);
    turnoverService = TestBed.inject(TurnoverService);
    experienceService = TestBed.inject(ExperienceService);
    sizeService = TestBed.inject(SizeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ActivityArea query and add missing value', () => {
      const sme: ISme = { id: 456 };
      const activityArea: IActivityArea = { id: 15523 };
      sme.activityArea = activityArea;

      const activityAreaCollection: IActivityArea[] = [{ id: 97546 }];
      jest.spyOn(activityAreaService, 'query').mockReturnValue(of(new HttpResponse({ body: activityAreaCollection })));
      const additionalActivityAreas = [activityArea];
      const expectedCollection: IActivityArea[] = [...additionalActivityAreas, ...activityAreaCollection];
      jest.spyOn(activityAreaService, 'addActivityAreaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sme });
      comp.ngOnInit();

      expect(activityAreaService.query).toHaveBeenCalled();
      expect(activityAreaService.addActivityAreaToCollectionIfMissing).toHaveBeenCalledWith(
        activityAreaCollection,
        ...additionalActivityAreas
      );
      expect(comp.activityAreasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Need query and add missing value', () => {
      const sme: ISme = { id: 456 };
      const need: INeed = { id: 68254 };
      sme.need = need;

      const needCollection: INeed[] = [{ id: 15400 }];
      jest.spyOn(needService, 'query').mockReturnValue(of(new HttpResponse({ body: needCollection })));
      const additionalNeeds = [need];
      const expectedCollection: INeed[] = [...additionalNeeds, ...needCollection];
      jest.spyOn(needService, 'addNeedToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sme });
      comp.ngOnInit();

      expect(needService.query).toHaveBeenCalled();
      expect(needService.addNeedToCollectionIfMissing).toHaveBeenCalledWith(needCollection, ...additionalNeeds);
      expect(comp.needsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call SMEHouse query and add missing value', () => {
      const sme: ISme = { id: 456 };
      const smeHouse: ISMEHouse = { id: 84670 };
      sme.smeHouse = smeHouse;

      const sMEHouseCollection: ISMEHouse[] = [{ id: 58611 }];
      jest.spyOn(sMEHouseService, 'query').mockReturnValue(of(new HttpResponse({ body: sMEHouseCollection })));
      const additionalSMEHouses = [smeHouse];
      const expectedCollection: ISMEHouse[] = [...additionalSMEHouses, ...sMEHouseCollection];
      jest.spyOn(sMEHouseService, 'addSMEHouseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sme });
      comp.ngOnInit();

      expect(sMEHouseService.query).toHaveBeenCalled();
      expect(sMEHouseService.addSMEHouseToCollectionIfMissing).toHaveBeenCalledWith(sMEHouseCollection, ...additionalSMEHouses);
      expect(comp.sMEHousesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Turnover query and add missing value', () => {
      const sme: ISme = { id: 456 };
      const turnover: ITurnover = { id: 34411 };
      sme.turnover = turnover;

      const turnoverCollection: ITurnover[] = [{ id: 84394 }];
      jest.spyOn(turnoverService, 'query').mockReturnValue(of(new HttpResponse({ body: turnoverCollection })));
      const additionalTurnovers = [turnover];
      const expectedCollection: ITurnover[] = [...additionalTurnovers, ...turnoverCollection];
      jest.spyOn(turnoverService, 'addTurnoverToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sme });
      comp.ngOnInit();

      expect(turnoverService.query).toHaveBeenCalled();
      expect(turnoverService.addTurnoverToCollectionIfMissing).toHaveBeenCalledWith(turnoverCollection, ...additionalTurnovers);
      expect(comp.turnoversSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Experience query and add missing value', () => {
      const sme: ISme = { id: 456 };
      const experience: IExperience = { id: 19630 };
      sme.experience = experience;

      const experienceCollection: IExperience[] = [{ id: 54190 }];
      jest.spyOn(experienceService, 'query').mockReturnValue(of(new HttpResponse({ body: experienceCollection })));
      const additionalExperiences = [experience];
      const expectedCollection: IExperience[] = [...additionalExperiences, ...experienceCollection];
      jest.spyOn(experienceService, 'addExperienceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sme });
      comp.ngOnInit();

      expect(experienceService.query).toHaveBeenCalled();
      expect(experienceService.addExperienceToCollectionIfMissing).toHaveBeenCalledWith(experienceCollection, ...additionalExperiences);
      expect(comp.experiencesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Size query and add missing value', () => {
      const sme: ISme = { id: 456 };
      const size: ISize = { id: 50192 };
      sme.size = size;

      const sizeCollection: ISize[] = [{ id: 33291 }];
      jest.spyOn(sizeService, 'query').mockReturnValue(of(new HttpResponse({ body: sizeCollection })));
      const additionalSizes = [size];
      const expectedCollection: ISize[] = [...additionalSizes, ...sizeCollection];
      jest.spyOn(sizeService, 'addSizeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sme });
      comp.ngOnInit();

      expect(sizeService.query).toHaveBeenCalled();
      expect(sizeService.addSizeToCollectionIfMissing).toHaveBeenCalledWith(sizeCollection, ...additionalSizes);
      expect(comp.sizesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sme: ISme = { id: 456 };
      const activityArea: IActivityArea = { id: 82809 };
      sme.activityArea = activityArea;
      const need: INeed = { id: 16235 };
      sme.need = need;
      const smeHouse: ISMEHouse = { id: 31766 };
      sme.smeHouse = smeHouse;
      const turnover: ITurnover = { id: 70160 };
      sme.turnover = turnover;
      const experience: IExperience = { id: 78073 };
      sme.experience = experience;
      const size: ISize = { id: 44859 };
      sme.size = size;

      activatedRoute.data = of({ sme });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sme));
      expect(comp.activityAreasSharedCollection).toContain(activityArea);
      expect(comp.needsSharedCollection).toContain(need);
      expect(comp.sMEHousesSharedCollection).toContain(smeHouse);
      expect(comp.turnoversSharedCollection).toContain(turnover);
      expect(comp.experiencesSharedCollection).toContain(experience);
      expect(comp.sizesSharedCollection).toContain(size);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sme>>();
      const sme = { id: 123 };
      jest.spyOn(smeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sme });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sme }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(smeService.update).toHaveBeenCalledWith(sme);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sme>>();
      const sme = new Sme();
      jest.spyOn(smeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sme });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sme }));
      saveSubject.complete();

      // THEN
      expect(smeService.create).toHaveBeenCalledWith(sme);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sme>>();
      const sme = { id: 123 };
      jest.spyOn(smeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sme });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(smeService.update).toHaveBeenCalledWith(sme);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackActivityAreaById', () => {
      it('Should return tracked ActivityArea primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackActivityAreaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackNeedById', () => {
      it('Should return tracked Need primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackNeedById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSMEHouseById', () => {
      it('Should return tracked SMEHouse primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSMEHouseById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTurnoverById', () => {
      it('Should return tracked Turnover primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTurnoverById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackExperienceById', () => {
      it('Should return tracked Experience primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackExperienceById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSizeById', () => {
      it('Should return tracked Size primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSizeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
