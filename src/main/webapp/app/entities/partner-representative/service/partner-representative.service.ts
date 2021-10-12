import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPartnerRepresentative, getPartnerRepresentativeIdentifier } from '../partner-representative.model';

export type EntityResponseType = HttpResponse<IPartnerRepresentative>;
export type EntityArrayResponseType = HttpResponse<IPartnerRepresentative[]>;

@Injectable({ providedIn: 'root' })
export class PartnerRepresentativeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/partner-representatives');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(partnerRepresentative: IPartnerRepresentative): Observable<EntityResponseType> {
    return this.http.post<IPartnerRepresentative>(this.resourceUrl, partnerRepresentative, { observe: 'response' });
  }

  update(partnerRepresentative: IPartnerRepresentative): Observable<EntityResponseType> {
    return this.http.put<IPartnerRepresentative>(
      `${this.resourceUrl}/${getPartnerRepresentativeIdentifier(partnerRepresentative) as number}`,
      partnerRepresentative,
      { observe: 'response' }
    );
  }

  partialUpdate(partnerRepresentative: IPartnerRepresentative): Observable<EntityResponseType> {
    return this.http.patch<IPartnerRepresentative>(
      `${this.resourceUrl}/${getPartnerRepresentativeIdentifier(partnerRepresentative) as number}`,
      partnerRepresentative,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPartnerRepresentative>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPartnerRepresentative[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPartnerRepresentativeToCollectionIfMissing(
    partnerRepresentativeCollection: IPartnerRepresentative[],
    ...partnerRepresentativesToCheck: (IPartnerRepresentative | null | undefined)[]
  ): IPartnerRepresentative[] {
    const partnerRepresentatives: IPartnerRepresentative[] = partnerRepresentativesToCheck.filter(isPresent);
    if (partnerRepresentatives.length > 0) {
      const partnerRepresentativeCollectionIdentifiers = partnerRepresentativeCollection.map(
        partnerRepresentativeItem => getPartnerRepresentativeIdentifier(partnerRepresentativeItem)!
      );
      const partnerRepresentativesToAdd = partnerRepresentatives.filter(partnerRepresentativeItem => {
        const partnerRepresentativeIdentifier = getPartnerRepresentativeIdentifier(partnerRepresentativeItem);
        if (
          partnerRepresentativeIdentifier == null ||
          partnerRepresentativeCollectionIdentifiers.includes(partnerRepresentativeIdentifier)
        ) {
          return false;
        }
        partnerRepresentativeCollectionIdentifiers.push(partnerRepresentativeIdentifier);
        return true;
      });
      return [...partnerRepresentativesToAdd, ...partnerRepresentativeCollection];
    }
    return partnerRepresentativeCollection;
  }
}
