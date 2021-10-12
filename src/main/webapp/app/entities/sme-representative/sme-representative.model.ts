import { IUser } from 'app/entities/user/user.model';
import { IPerson } from 'app/entities/person/person.model';
import { ISme } from 'app/entities/sme/sme.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';

export interface ISmeRepresentative {
  id?: number;
  jobTitle?: string | null;
  isAdmin?: boolean | null;
  isManager?: boolean | null;
  internalUser?: IUser | null;
  person?: IPerson;
  sme?: ISme;
  appointments?: IAppointment[] | null;
}

export class SmeRepresentative implements ISmeRepresentative {
  constructor(
    public id?: number,
    public jobTitle?: string | null,
    public isAdmin?: boolean | null,
    public isManager?: boolean | null,
    public internalUser?: IUser | null,
    public person?: IPerson,
    public sme?: ISme,
    public appointments?: IAppointment[] | null
  ) {
    this.isAdmin = this.isAdmin ?? false;
    this.isManager = this.isManager ?? false;
  }
}

export function getSmeRepresentativeIdentifier(smeRepresentative: ISmeRepresentative): number | undefined {
  return smeRepresentative.id;
}
