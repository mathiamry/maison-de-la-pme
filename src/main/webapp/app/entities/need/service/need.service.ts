import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INeed, getNeedIdentifier } from '../need.model';

export type EntityResponseType = HttpResponse<INeed>;
export type EntityArrayResponseType = HttpResponse<INeed[]>;

@Injectable({ providedIn: 'root' })
export class NeedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/needs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(need: INeed): Observable<EntityResponseType> {
    return this.http.post<INeed>(this.resourceUrl, need, { observe: 'response' });
  }

  update(need: INeed): Observable<EntityResponseType> {
    return this.http.put<INeed>(`${this.resourceUrl}/${getNeedIdentifier(need) as number}`, need, { observe: 'response' });
  }

  partialUpdate(need: INeed): Observable<EntityResponseType> {
    return this.http.patch<INeed>(`${this.resourceUrl}/${getNeedIdentifier(need) as number}`, need, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INeed>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INeed[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNeedToCollectionIfMissing(needCollection: INeed[], ...needsToCheck: (INeed | null | undefined)[]): INeed[] {
    const needs: INeed[] = needsToCheck.filter(isPresent);
    if (needs.length > 0) {
      const needCollectionIdentifiers = needCollection.map(needItem => getNeedIdentifier(needItem)!);
      const needsToAdd = needs.filter(needItem => {
        const needIdentifier = getNeedIdentifier(needItem);
        if (needIdentifier == null || needCollectionIdentifiers.includes(needIdentifier)) {
          return false;
        }
        needCollectionIdentifiers.push(needIdentifier);
        return true;
      });
      return [...needsToAdd, ...needCollection];
    }
    return needCollection;
  }
}
