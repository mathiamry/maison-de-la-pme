import { ISme } from 'app/entities/sme/sme.model';

export interface ITurnover {
  id?: number;
  min?: number | null;
  max?: number | null;
  description?: string | null;
  smes?: ISme[] | null;
}

export class Turnover implements ITurnover {
  constructor(
    public id?: number,
    public min?: number | null,
    public max?: number | null,
    public description?: string | null,
    public smes?: ISme[] | null
  ) {}
}

export function getTurnoverIdentifier(turnover: ITurnover): number | undefined {
  return turnover.id;
}
