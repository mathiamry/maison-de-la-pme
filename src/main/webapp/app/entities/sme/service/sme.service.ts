import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISme, getSmeIdentifier } from '../sme.model';

export type EntityResponseType = HttpResponse<ISme>;
export type EntityArrayResponseType = HttpResponse<ISme[]>;

@Injectable({ providedIn: 'root' })
export class SmeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/smes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sme: ISme): Observable<EntityResponseType> {
    return this.http.post<ISme>(this.resourceUrl, sme, { observe: 'response' });
  }

  update(sme: ISme): Observable<EntityResponseType> {
    return this.http.put<ISme>(`${this.resourceUrl}/${getSmeIdentifier(sme) as number}`, sme, { observe: 'response' });
  }

  partialUpdate(sme: ISme): Observable<EntityResponseType> {
    return this.http.patch<ISme>(`${this.resourceUrl}/${getSmeIdentifier(sme) as number}`, sme, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISme>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISme[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSmeToCollectionIfMissing(smeCollection: ISme[], ...smesToCheck: (ISme | null | undefined)[]): ISme[] {
    const smes: ISme[] = smesToCheck.filter(isPresent);
    if (smes.length > 0) {
      const smeCollectionIdentifiers = smeCollection.map(smeItem => getSmeIdentifier(smeItem)!);
      const smesToAdd = smes.filter(smeItem => {
        const smeIdentifier = getSmeIdentifier(smeItem);
        if (smeIdentifier == null || smeCollectionIdentifiers.includes(smeIdentifier)) {
          return false;
        }
        smeCollectionIdentifiers.push(smeIdentifier);
        return true;
      });
      return [...smesToAdd, ...smeCollection];
    }
    return smeCollection;
  }
}
