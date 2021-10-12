import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { INotification, Notification } from '../notification.model';
import { NotificationService } from '../service/notification.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { INews } from 'app/entities/news/news.model';
import { NewsService } from 'app/entities/news/service/news.service';
import { ITender } from 'app/entities/tender/tender.model';
import { TenderService } from 'app/entities/tender/service/tender.service';

@Component({
  selector: 'jhi-notification-update',
  templateUrl: './notification-update.component.html',
})
export class NotificationUpdateComponent implements OnInit {
  isSaving = false;

  eventsSharedCollection: IEvent[] = [];
  newsSharedCollection: INews[] = [];
  tendersSharedCollection: ITender[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    broadcast: [],
    description: [],
    createdAt: [],
    event: [],
    news: [],
    tender: [],
  });

  constructor(
    protected notificationService: NotificationService,
    protected eventService: EventService,
    protected newsService: NewsService,
    protected tenderService: TenderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notification }) => {
      if (notification.id === undefined) {
        const today = dayjs().startOf('day');
        notification.createdAt = today;
      }

      this.updateForm(notification);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const notification = this.createFromForm();
    if (notification.id !== undefined) {
      this.subscribeToSaveResponse(this.notificationService.update(notification));
    } else {
      this.subscribeToSaveResponse(this.notificationService.create(notification));
    }
  }

  trackEventById(index: number, item: IEvent): number {
    return item.id!;
  }

  trackNewsById(index: number, item: INews): number {
    return item.id!;
  }

  trackTenderById(index: number, item: ITender): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INotification>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(notification: INotification): void {
    this.editForm.patchValue({
      id: notification.id,
      title: notification.title,
      broadcast: notification.broadcast,
      description: notification.description,
      createdAt: notification.createdAt ? notification.createdAt.format(DATE_TIME_FORMAT) : null,
      event: notification.event,
      news: notification.news,
      tender: notification.tender,
    });

    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing(this.eventsSharedCollection, notification.event);
    this.newsSharedCollection = this.newsService.addNewsToCollectionIfMissing(this.newsSharedCollection, notification.news);
    this.tendersSharedCollection = this.tenderService.addTenderToCollectionIfMissing(this.tendersSharedCollection, notification.tender);
  }

  protected loadRelationshipsOptions(): void {
    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing(events, this.editForm.get('event')!.value)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));

    this.newsService
      .query()
      .pipe(map((res: HttpResponse<INews[]>) => res.body ?? []))
      .pipe(map((news: INews[]) => this.newsService.addNewsToCollectionIfMissing(news, this.editForm.get('news')!.value)))
      .subscribe((news: INews[]) => (this.newsSharedCollection = news));

    this.tenderService
      .query()
      .pipe(map((res: HttpResponse<ITender[]>) => res.body ?? []))
      .pipe(map((tenders: ITender[]) => this.tenderService.addTenderToCollectionIfMissing(tenders, this.editForm.get('tender')!.value)))
      .subscribe((tenders: ITender[]) => (this.tendersSharedCollection = tenders));
  }

  protected createFromForm(): INotification {
    return {
      ...new Notification(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      broadcast: this.editForm.get(['broadcast'])!.value,
      description: this.editForm.get(['description'])!.value,
      createdAt: this.editForm.get(['createdAt'])!.value ? dayjs(this.editForm.get(['createdAt'])!.value, DATE_TIME_FORMAT) : undefined,
      event: this.editForm.get(['event'])!.value,
      news: this.editForm.get(['news'])!.value,
      tender: this.editForm.get(['tender'])!.value,
    };
  }
}
