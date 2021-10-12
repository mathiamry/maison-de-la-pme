import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { INotification } from 'app/entities/notification/notification.model';

export interface IEvent {
  id?: number;
  title?: string;
  description?: string | null;
  location?: string | null;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  isPublished?: boolean | null;
  author?: IUser;
  participants?: IUser[] | null;
  notifications?: INotification[] | null;
}

export class Event implements IEvent {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string | null,
    public location?: string | null,
    public startDate?: dayjs.Dayjs,
    public endDate?: dayjs.Dayjs,
    public isPublished?: boolean | null,
    public author?: IUser,
    public participants?: IUser[] | null,
    public notifications?: INotification[] | null
  ) {
    this.isPublished = this.isPublished ?? false;
  }
}

export function getEventIdentifier(event: IEvent): number | undefined {
  return event.id;
}
