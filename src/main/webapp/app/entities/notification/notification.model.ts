import * as dayjs from 'dayjs';
import { IEvent } from 'app/entities/event/event.model';
import { INews } from 'app/entities/news/news.model';
import { ITender } from 'app/entities/tender/tender.model';

export interface INotification {
  id?: number;
  title?: string;
  broadcast?: boolean | null;
  description?: string | null;
  createdAt?: dayjs.Dayjs | null;
  event?: IEvent | null;
  news?: INews | null;
  tender?: ITender | null;
}

export class Notification implements INotification {
  constructor(
    public id?: number,
    public title?: string,
    public broadcast?: boolean | null,
    public description?: string | null,
    public createdAt?: dayjs.Dayjs | null,
    public event?: IEvent | null,
    public news?: INews | null,
    public tender?: ITender | null
  ) {
    this.broadcast = this.broadcast ?? false;
  }
}

export function getNotificationIdentifier(notification: INotification): number | undefined {
  return notification.id;
}
