import { ISme } from 'app/entities/sme/sme.model';

export interface ISize {
  id?: number;
  min?: number | null;
  max?: number | null;
  description?: string | null;
  smes?: ISme[] | null;
}

export class Size implements ISize {
  constructor(
    public id?: number,
    public min?: number | null,
    public max?: number | null,
    public description?: string | null,
    public smes?: ISme[] | null
  ) {}
}

export function getSizeIdentifier(size: ISize): number | undefined {
  return size.id;
}
