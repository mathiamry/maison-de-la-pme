jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { NotificationService } from '../service/notification.service';
import { INotification, Notification } from '../notification.model';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { INews } from 'app/entities/news/news.model';
import { NewsService } from 'app/entities/news/service/news.service';
import { ITender } from 'app/entities/tender/tender.model';
import { TenderService } from 'app/entities/tender/service/tender.service';

import { NotificationUpdateComponent } from './notification-update.component';

describe('Notification Management Update Component', () => {
  let comp: NotificationUpdateComponent;
  let fixture: ComponentFixture<NotificationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let notificationService: NotificationService;
  let eventService: EventService;
  let newsService: NewsService;
  let tenderService: TenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [NotificationUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(NotificationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NotificationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    notificationService = TestBed.inject(NotificationService);
    eventService = TestBed.inject(EventService);
    newsService = TestBed.inject(NewsService);
    tenderService = TestBed.inject(TenderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Event query and add missing value', () => {
      const notification: INotification = { id: 456 };
      const event: IEvent = { id: 65381 };
      notification.event = event;

      const eventCollection: IEvent[] = [{ id: 45369 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call News query and add missing value', () => {
      const notification: INotification = { id: 456 };
      const news: INews = { id: 42489 };
      notification.news = news;

      const newsCollection: INews[] = [{ id: 79535 }];
      jest.spyOn(newsService, 'query').mockReturnValue(of(new HttpResponse({ body: newsCollection })));
      const additionalNews = [news];
      const expectedCollection: INews[] = [...additionalNews, ...newsCollection];
      jest.spyOn(newsService, 'addNewsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      expect(newsService.query).toHaveBeenCalled();
      expect(newsService.addNewsToCollectionIfMissing).toHaveBeenCalledWith(newsCollection, ...additionalNews);
      expect(comp.newsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Tender query and add missing value', () => {
      const notification: INotification = { id: 456 };
      const tender: ITender = { id: 65556 };
      notification.tender = tender;

      const tenderCollection: ITender[] = [{ id: 4645 }];
      jest.spyOn(tenderService, 'query').mockReturnValue(of(new HttpResponse({ body: tenderCollection })));
      const additionalTenders = [tender];
      const expectedCollection: ITender[] = [...additionalTenders, ...tenderCollection];
      jest.spyOn(tenderService, 'addTenderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      expect(tenderService.query).toHaveBeenCalled();
      expect(tenderService.addTenderToCollectionIfMissing).toHaveBeenCalledWith(tenderCollection, ...additionalTenders);
      expect(comp.tendersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const notification: INotification = { id: 456 };
      const event: IEvent = { id: 97363 };
      notification.event = event;
      const news: INews = { id: 36837 };
      notification.news = news;
      const tender: ITender = { id: 84627 };
      notification.tender = tender;

      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(notification));
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.newsSharedCollection).toContain(news);
      expect(comp.tendersSharedCollection).toContain(tender);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Notification>>();
      const notification = { id: 123 };
      jest.spyOn(notificationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notification }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(notificationService.update).toHaveBeenCalledWith(notification);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Notification>>();
      const notification = new Notification();
      jest.spyOn(notificationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notification }));
      saveSubject.complete();

      // THEN
      expect(notificationService.create).toHaveBeenCalledWith(notification);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Notification>>();
      const notification = { id: 123 };
      jest.spyOn(notificationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(notificationService.update).toHaveBeenCalledWith(notification);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEventById', () => {
      it('Should return tracked Event primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackNewsById', () => {
      it('Should return tracked News primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackNewsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTenderById', () => {
      it('Should return tracked Tender primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTenderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
