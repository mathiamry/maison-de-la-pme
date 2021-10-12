import { ISme } from 'app/entities/sme/sme.model';

export interface IBank {
  id?: number;
  name?: string;
  description?: string | null;
  smes?: ISme[] | null;
}

export class Bank implements IBank {
  constructor(public id?: number, public name?: string, public description?: string | null, public smes?: ISme[] | null) {}
}

export function getBankIdentifier(bank: IBank): number | undefined {
  return bank.id;
}
