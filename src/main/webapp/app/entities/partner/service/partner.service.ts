import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPartner, getPartnerIdentifier } from '../partner.model';

export type EntityResponseType = HttpResponse<IPartner>;
export type EntityArrayResponseType = HttpResponse<IPartner[]>;

@Injectable({ providedIn: 'root' })
export class PartnerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/partners');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(partner: IPartner): Observable<EntityResponseType> {
    return this.http.post<IPartner>(this.resourceUrl, partner, { observe: 'response' });
  }

  update(partner: IPartner): Observable<EntityResponseType> {
    return this.http.put<IPartner>(`${this.resourceUrl}/${getPartnerIdentifier(partner) as number}`, partner, { observe: 'response' });
  }

  partialUpdate(partner: IPartner): Observable<EntityResponseType> {
    return this.http.patch<IPartner>(`${this.resourceUrl}/${getPartnerIdentifier(partner) as number}`, partner, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPartner>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPartner[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPartnerToCollectionIfMissing(partnerCollection: IPartner[], ...partnersToCheck: (IPartner | null | undefined)[]): IPartner[] {
    const partners: IPartner[] = partnersToCheck.filter(isPresent);
    if (partners.length > 0) {
      const partnerCollectionIdentifiers = partnerCollection.map(partnerItem => getPartnerIdentifier(partnerItem)!);
      const partnersToAdd = partners.filter(partnerItem => {
        const partnerIdentifier = getPartnerIdentifier(partnerItem);
        if (partnerIdentifier == null || partnerCollectionIdentifiers.includes(partnerIdentifier)) {
          return false;
        }
        partnerCollectionIdentifiers.push(partnerIdentifier);
        return true;
      });
      return [...partnersToAdd, ...partnerCollection];
    }
    return partnerCollection;
  }
}
