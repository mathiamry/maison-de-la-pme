import { ILanguage } from 'app/entities/language/language.model';

export interface IPerson {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  language?: ILanguage | null;
}

export class Person implements IPerson {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public phone?: string | null,
    public language?: ILanguage | null
  ) {}
}

export function getPersonIdentifier(person: IPerson): number | undefined {
  return person.id;
}
