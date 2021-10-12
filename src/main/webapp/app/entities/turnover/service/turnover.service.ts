import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITurnover, getTurnoverIdentifier } from '../turnover.model';

export type EntityResponseType = HttpResponse<ITurnover>;
export type EntityArrayResponseType = HttpResponse<ITurnover[]>;

@Injectable({ providedIn: 'root' })
export class TurnoverService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/turnovers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(turnover: ITurnover): Observable<EntityResponseType> {
    return this.http.post<ITurnover>(this.resourceUrl, turnover, { observe: 'response' });
  }

  update(turnover: ITurnover): Observable<EntityResponseType> {
    return this.http.put<ITurnover>(`${this.resourceUrl}/${getTurnoverIdentifier(turnover) as number}`, turnover, { observe: 'response' });
  }

  partialUpdate(turnover: ITurnover): Observable<EntityResponseType> {
    return this.http.patch<ITurnover>(`${this.resourceUrl}/${getTurnoverIdentifier(turnover) as number}`, turnover, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITurnover>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITurnover[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTurnoverToCollectionIfMissing(turnoverCollection: ITurnover[], ...turnoversToCheck: (ITurnover | null | undefined)[]): ITurnover[] {
    const turnovers: ITurnover[] = turnoversToCheck.filter(isPresent);
    if (turnovers.length > 0) {
      const turnoverCollectionIdentifiers = turnoverCollection.map(turnoverItem => getTurnoverIdentifier(turnoverItem)!);
      const turnoversToAdd = turnovers.filter(turnoverItem => {
        const turnoverIdentifier = getTurnoverIdentifier(turnoverItem);
        if (turnoverIdentifier == null || turnoverCollectionIdentifiers.includes(turnoverIdentifier)) {
          return false;
        }
        turnoverCollectionIdentifiers.push(turnoverIdentifier);
        return true;
      });
      return [...turnoversToAdd, ...turnoverCollection];
    }
    return turnoverCollection;
  }
}
