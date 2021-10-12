import { IUser } from 'app/entities/user/user.model';
import { IPerson } from 'app/entities/person/person.model';
import { ISMEHouse } from 'app/entities/sme-house/sme-house.model';

export interface IAdministrator {
  id?: number;
  jobTitle?: string | null;
  description?: string | null;
  internalUser?: IUser;
  person?: IPerson;
  houseSmes?: ISMEHouse[] | null;
}

export class Administrator implements IAdministrator {
  constructor(
    public id?: number,
    public jobTitle?: string | null,
    public description?: string | null,
    public internalUser?: IUser,
    public person?: IPerson,
    public houseSmes?: ISMEHouse[] | null
  ) {}
}

export function getAdministratorIdentifier(administrator: IAdministrator): number | undefined {
  return administrator.id;
}
