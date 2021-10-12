import * as dayjs from 'dayjs';
import { IPerson } from 'app/entities/person/person.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';

export interface IAnonymous {
  id?: number;
  visitDate?: dayjs.Dayjs;
  person?: IPerson;
  appointments?: IAppointment | null;
}

export class Anonymous implements IAnonymous {
  constructor(public id?: number, public visitDate?: dayjs.Dayjs, public person?: IPerson, public appointments?: IAppointment | null) {}
}

export function getAnonymousIdentifier(anonymous: IAnonymous): number | undefined {
  return anonymous.id;
}
