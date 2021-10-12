import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { INotification } from 'app/entities/notification/notification.model';

export interface INews {
  id?: number;
  title?: string;
  description?: string | null;
  createdAt?: dayjs.Dayjs | null;
  author?: IUser;
  notifications?: INotification[] | null;
}

export class News implements INews {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string | null,
    public createdAt?: dayjs.Dayjs | null,
    public author?: IUser,
    public notifications?: INotification[] | null
  ) {}
}

export function getNewsIdentifier(news: INews): number | undefined {
  return news.id;
}
