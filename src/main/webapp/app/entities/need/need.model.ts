import { ISme } from 'app/entities/sme/sme.model';

export interface INeed {
  id?: number;
  name?: string;
  smes?: ISme[] | null;
}

export class Need implements INeed {
  constructor(public id?: number, public name?: string, public smes?: ISme[] | null) {}
}

export function getNeedIdentifier(need: INeed): number | undefined {
  return need.id;
}
