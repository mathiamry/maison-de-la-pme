import { IUser } from 'app/entities/user/user.model';

export interface IFrequentlyAskedQuestion {
  id?: number;
  question?: string;
  answer?: string;
  order?: number | null;
  isPublished?: boolean | null;
  author?: IUser;
}

export class FrequentlyAskedQuestion implements IFrequentlyAskedQuestion {
  constructor(
    public id?: number,
    public question?: string,
    public answer?: string,
    public order?: number | null,
    public isPublished?: boolean | null,
    public author?: IUser
  ) {
    this.isPublished = this.isPublished ?? false;
  }
}

export function getFrequentlyAskedQuestionIdentifier(frequentlyAskedQuestion: IFrequentlyAskedQuestion): number | undefined {
  return frequentlyAskedQuestion.id;
}
