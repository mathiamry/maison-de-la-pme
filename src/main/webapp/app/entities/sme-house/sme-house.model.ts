import { ICountry } from 'app/entities/country/country.model';
import { IAdministrator } from 'app/entities/administrator/administrator.model';
import { IAdvisor } from 'app/entities/advisor/advisor.model';
import { IPartner } from 'app/entities/partner/partner.model';
import { ISme } from 'app/entities/sme/sme.model';

export interface ISMEHouse {
  id?: number;
  name?: string;
  description?: string | null;
  address?: string | null;
  email?: string;
  phone?: string;
  country?: ICountry;
  administrator?: IAdministrator;
  advisors?: IAdvisor[] | null;
  partners?: IPartner[] | null;
  smes?: ISme[] | null;
}

export class SMEHouse implements ISMEHouse {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public address?: string | null,
    public email?: string,
    public phone?: string,
    public country?: ICountry,
    public administrator?: IAdministrator,
    public advisors?: IAdvisor[] | null,
    public partners?: IPartner[] | null,
    public smes?: ISme[] | null
  ) {}
}

export function getSMEHouseIdentifier(sMEHouse: ISMEHouse): number | undefined {
  return sMEHouse.id;
}
