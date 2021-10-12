import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';

export interface IHistory {
  id?: number;
  origin?: string;
  action?: string | null;
  actionDate?: dayjs.Dayjs | null;
  author?: IUser;
}

export class History implements IHistory {
  constructor(
    public id?: number,
    public origin?: string,
    public action?: string | null,
    public actionDate?: dayjs.Dayjs | null,
    public author?: IUser
  ) {}
}

export function getHistoryIdentifier(history: IHistory): number | undefined {
  return history.id;
}
