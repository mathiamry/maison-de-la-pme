import { ICountry } from 'app/entities/country/country.model';
import { IPerson } from 'app/entities/person/person.model';

export interface ILanguage {
  id?: number;
  name?: string;
  key?: string;
  countries?: ICountry[] | null;
  persons?: IPerson[] | null;
}

export class Language implements ILanguage {
  constructor(
    public id?: number,
    public name?: string,
    public key?: string,
    public countries?: ICountry[] | null,
    public persons?: IPerson[] | null
  ) {}
}

export function getLanguageIdentifier(language: ILanguage): number | undefined {
  return language.id;
}
