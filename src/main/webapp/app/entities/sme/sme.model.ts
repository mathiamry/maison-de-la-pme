import { IActivityArea } from 'app/entities/activity-area/activity-area.model';
import { INeed } from 'app/entities/need/need.model';
import { ISMEHouse } from 'app/entities/sme-house/sme-house.model';
import { ITurnover } from 'app/entities/turnover/turnover.model';
import { IExperience } from 'app/entities/experience/experience.model';
import { ISize } from 'app/entities/size/size.model';
import { IBank } from 'app/entities/bank/bank.model';
import { ISmeRepresentative } from 'app/entities/sme-representative/sme-representative.model';
import { IFile } from 'app/entities/file/file.model';

export interface ISme {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  phone2?: string | null;
  logo?: string | null;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  webSite?: string | null;
  smeImmatriculationNumber?: string;
  isClient?: boolean | null;
  isAuthorized?: boolean | null;
  termsOfUse?: string | null;
  isValid?: boolean | null;
  activityArea?: IActivityArea;
  need?: INeed | null;
  smeHouse?: ISMEHouse;
  turnover?: ITurnover | null;
  experience?: IExperience | null;
  size?: ISize | null;
  bank?: IBank | null;
  representatives?: ISmeRepresentative[] | null;
  files?: IFile[] | null;
}

export class Sme implements ISme {
  constructor(
    public id?: number,
    public name?: string,
    public email?: string,
    public phone?: string,
    public phone2?: string | null,
    public logo?: string | null,
    public address?: string | null,
    public latitude?: string | null,
    public longitude?: string | null,
    public webSite?: string | null,
    public smeImmatriculationNumber?: string,
    public isClient?: boolean | null,
    public isAuthorized?: boolean | null,
    public termsOfUse?: string | null,
    public isValid?: boolean | null,
    public activityArea?: IActivityArea,
    public need?: INeed | null,
    public smeHouse?: ISMEHouse,
    public turnover?: ITurnover | null,
    public experience?: IExperience | null,
    public size?: ISize | null,
    public bank?: IBank | null,
    public representatives?: ISmeRepresentative[] | null,
    public files?: IFile[] | null
  ) {
    this.isClient = this.isClient ?? false;
    this.isAuthorized = this.isAuthorized ?? false;
    this.isValid = this.isValid ?? false;
  }
}

export function getSmeIdentifier(sme: ISme): number | undefined {
  return sme.id;
}
