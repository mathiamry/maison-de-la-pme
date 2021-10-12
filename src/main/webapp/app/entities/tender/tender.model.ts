import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IFile } from 'app/entities/file/file.model';
import { INotification } from 'app/entities/notification/notification.model';

export interface ITender {
  id?: number;
  title?: string;
  description?: string | null;
  publishDate?: dayjs.Dayjs | null;
  expiryDate?: dayjs.Dayjs | null;
  isValid?: boolean | null;
  isArchived?: boolean | null;
  isPublished?: boolean | null;
  author?: IUser;
  files?: IFile[] | null;
  notifications?: INotification[] | null;
}

export class Tender implements ITender {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string | null,
    public publishDate?: dayjs.Dayjs | null,
    public expiryDate?: dayjs.Dayjs | null,
    public isValid?: boolean | null,
    public isArchived?: boolean | null,
    public isPublished?: boolean | null,
    public author?: IUser,
    public files?: IFile[] | null,
    public notifications?: INotification[] | null
  ) {
    this.isValid = this.isValid ?? false;
    this.isArchived = this.isArchived ?? false;
    this.isPublished = this.isPublished ?? false;
  }
}

export function getTenderIdentifier(tender: ITender): number | undefined {
  return tender.id;
}
