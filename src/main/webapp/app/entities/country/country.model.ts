import { ILanguage } from 'app/entities/language/language.model';
import { ISMEHouse } from 'app/entities/sme-house/sme-house.model';

export interface ICountry {
  id?: number;
  name?: string;
  language?: ILanguage | null;
  smeHouses?: ISMEHouse[] | null;
}

export class Country implements ICountry {
  constructor(public id?: number, public name?: string, public language?: ILanguage | null, public smeHouses?: ISMEHouse[] | null) {}
}

export function getCountryIdentifier(country: ICountry): number | undefined {
  return country.id;
}
