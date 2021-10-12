import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISmeRepresentative, getSmeRepresentativeIdentifier } from '../sme-representative.model';

export type EntityResponseType = HttpResponse<ISmeRepresentative>;
export type EntityArrayResponseType = HttpResponse<ISmeRepresentative[]>;

@Injectable({ providedIn: 'root' })
export class SmeRepresentativeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sme-representatives');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(smeRepresentative: ISmeRepresentative): Observable<EntityResponseType> {
    return this.http.post<ISmeRepresentative>(this.resourceUrl, smeRepresentative, { observe: 'response' });
  }

  update(smeRepresentative: ISmeRepresentative): Observable<EntityResponseType> {
    return this.http.put<ISmeRepresentative>(
      `${this.resourceUrl}/${getSmeRepresentativeIdentifier(smeRepresentative) as number}`,
      smeRepresentative,
      { observe: 'response' }
    );
  }

  partialUpdate(smeRepresentative: ISmeRepresentative): Observable<EntityResponseType> {
    return this.http.patch<ISmeRepresentative>(
      `${this.resourceUrl}/${getSmeRepresentativeIdentifier(smeRepresentative) as number}`,
      smeRepresentative,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISmeRepresentative>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISmeRepresentative[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSmeRepresentativeToCollectionIfMissing(
    smeRepresentativeCollection: ISmeRepresentative[],
    ...smeRepresentativesToCheck: (ISmeRepresentative | null | undefined)[]
  ): ISmeRepresentative[] {
    const smeRepresentatives: ISmeRepresentative[] = smeRepresentativesToCheck.filter(isPresent);
    if (smeRepresentatives.length > 0) {
      const smeRepresentativeCollectionIdentifiers = smeRepresentativeCollection.map(
        smeRepresentativeItem => getSmeRepresentativeIdentifier(smeRepresentativeItem)!
      );
      const smeRepresentativesToAdd = smeRepresentatives.filter(smeRepresentativeItem => {
        const smeRepresentativeIdentifier = getSmeRepresentativeIdentifier(smeRepresentativeItem);
        if (smeRepresentativeIdentifier == null || smeRepresentativeCollectionIdentifiers.includes(smeRepresentativeIdentifier)) {
          return false;
        }
        smeRepresentativeCollectionIdentifiers.push(smeRepresentativeIdentifier);
        return true;
      });
      return [...smeRepresentativesToAdd, ...smeRepresentativeCollection];
    }
    return smeRepresentativeCollection;
  }
}
