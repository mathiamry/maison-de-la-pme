import { ISme } from 'app/entities/sme/sme.model';

export interface IExperience {
  id?: number;
  min?: number | null;
  max?: number | null;
  description?: string | null;
  smes?: ISme[] | null;
}

export class Experience implements IExperience {
  constructor(
    public id?: number,
    public min?: number | null,
    public max?: number | null,
    public description?: string | null,
    public smes?: ISme[] | null
  ) {}
}

export function getExperienceIdentifier(experience: IExperience): number | undefined {
  return experience.id;
}
