import { ISMEHouse } from 'app/entities/sme-house/sme-house.model';
import { IPartnerRepresentative } from 'app/entities/partner-representative/partner-representative.model';

export interface IPartner {
  id?: number;
  name?: string;
  address?: string | null;
  email?: string;
  phone?: string;
  logo?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  smeHouse?: ISMEHouse;
  representings?: IPartnerRepresentative[] | null;
}

export class Partner implements IPartner {
  constructor(
    public id?: number,
    public name?: string,
    public address?: string | null,
    public email?: string,
    public phone?: string,
    public logo?: string | null,
    public latitude?: string | null,
    public longitude?: string | null,
    public smeHouse?: ISMEHouse,
    public representings?: IPartnerRepresentative[] | null
  ) {}
}

export function getPartnerIdentifier(partner: IPartner): number | undefined {
  return partner.id;
}
