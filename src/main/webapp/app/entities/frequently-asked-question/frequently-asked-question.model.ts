import { IUser } from 'app/entities/user/user.model';
import { ISMEHouse } from 'app/entities/sme-house/sme-house.model';

export interface IFrequentlyAskedQuestion {
  id?: number;
  question?: string;
  answer?: string;
  order?: number | null;
  isPublished?: boolean | null;
  author?: IUser;
  smeHouses?: ISMEHouse[] | null;
}

export class FrequentlyAskedQuestion implements IFrequentlyAskedQuestion {
  constructor(
    public id?: number,
    public question?: string,
    public answer?: string,
    public order?: number | null,
    public isPublished?: boolean | null,
    public author?: IUser,
    public smeHouses?: ISMEHouse[] | null
  ) {
    this.isPublished = this.isPublished ?? false;
  }
}

export function getFrequentlyAskedQuestionIdentifier(frequentlyAskedQuestion: IFrequentlyAskedQuestion): number | undefined {
  return frequentlyAskedQuestion.id;
}
