import { ISme } from 'app/entities/sme/sme.model';

export interface IActivityArea {
  id?: number;
  name?: string;
  smes?: ISme[] | null;
}

export class ActivityArea implements IActivityArea {
  constructor(public id?: number, public name?: string, public smes?: ISme[] | null) {}
}

export function getActivityAreaIdentifier(activityArea: IActivityArea): number | undefined {
  return activityArea.id;
}
