import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFrequentlyAskedQuestion, getFrequentlyAskedQuestionIdentifier } from '../frequently-asked-question.model';

export type EntityResponseType = HttpResponse<IFrequentlyAskedQuestion>;
export type EntityArrayResponseType = HttpResponse<IFrequentlyAskedQuestion[]>;

@Injectable({ providedIn: 'root' })
export class FrequentlyAskedQuestionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/frequently-asked-questions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(frequentlyAskedQuestion: IFrequentlyAskedQuestion): Observable<EntityResponseType> {
    return this.http.post<IFrequentlyAskedQuestion>(this.resourceUrl, frequentlyAskedQuestion, { observe: 'response' });
  }

  update(frequentlyAskedQuestion: IFrequentlyAskedQuestion): Observable<EntityResponseType> {
    return this.http.put<IFrequentlyAskedQuestion>(
      `${this.resourceUrl}/${getFrequentlyAskedQuestionIdentifier(frequentlyAskedQuestion) as number}`,
      frequentlyAskedQuestion,
      { observe: 'response' }
    );
  }

  partialUpdate(frequentlyAskedQuestion: IFrequentlyAskedQuestion): Observable<EntityResponseType> {
    return this.http.patch<IFrequentlyAskedQuestion>(
      `${this.resourceUrl}/${getFrequentlyAskedQuestionIdentifier(frequentlyAskedQuestion) as number}`,
      frequentlyAskedQuestion,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFrequentlyAskedQuestion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFrequentlyAskedQuestion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFrequentlyAskedQuestionToCollectionIfMissing(
    frequentlyAskedQuestionCollection: IFrequentlyAskedQuestion[],
    ...frequentlyAskedQuestionsToCheck: (IFrequentlyAskedQuestion | null | undefined)[]
  ): IFrequentlyAskedQuestion[] {
    const frequentlyAskedQuestions: IFrequentlyAskedQuestion[] = frequentlyAskedQuestionsToCheck.filter(isPresent);
    if (frequentlyAskedQuestions.length > 0) {
      const frequentlyAskedQuestionCollectionIdentifiers = frequentlyAskedQuestionCollection.map(
        frequentlyAskedQuestionItem => getFrequentlyAskedQuestionIdentifier(frequentlyAskedQuestionItem)!
      );
      const frequentlyAskedQuestionsToAdd = frequentlyAskedQuestions.filter(frequentlyAskedQuestionItem => {
        const frequentlyAskedQuestionIdentifier = getFrequentlyAskedQuestionIdentifier(frequentlyAskedQuestionItem);
        if (
          frequentlyAskedQuestionIdentifier == null ||
          frequentlyAskedQuestionCollectionIdentifiers.includes(frequentlyAskedQuestionIdentifier)
        ) {
          return false;
        }
        frequentlyAskedQuestionCollectionIdentifiers.push(frequentlyAskedQuestionIdentifier);
        return true;
      });
      return [...frequentlyAskedQuestionsToAdd, ...frequentlyAskedQuestionCollection];
    }
    return frequentlyAskedQuestionCollection;
  }
}
