import { ITender } from 'app/entities/tender/tender.model';
import { ISme } from 'app/entities/sme/sme.model';

export interface IFile {
  id?: number;
  name?: string | null;
  url?: string;
  tender?: ITender | null;
  sme?: ISme | null;
}

export class File implements IFile {
  constructor(
    public id?: number,
    public name?: string | null,
    public url?: string,
    public tender?: ITender | null,
    public sme?: ISme | null
  ) {}
}

export function getFileIdentifier(file: IFile): number | undefined {
  return file.id;
}
