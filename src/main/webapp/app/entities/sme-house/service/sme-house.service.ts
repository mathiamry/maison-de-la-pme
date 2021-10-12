import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISMEHouse, getSMEHouseIdentifier } from '../sme-house.model';

export type EntityResponseType = HttpResponse<ISMEHouse>;
export type EntityArrayResponseType = HttpResponse<ISMEHouse[]>;

@Injectable({ providedIn: 'root' })
export class SMEHouseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sme-houses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sMEHouse: ISMEHouse): Observable<EntityResponseType> {
    return this.http.post<ISMEHouse>(this.resourceUrl, sMEHouse, { observe: 'response' });
  }

  update(sMEHouse: ISMEHouse): Observable<EntityResponseType> {
    return this.http.put<ISMEHouse>(`${this.resourceUrl}/${getSMEHouseIdentifier(sMEHouse) as number}`, sMEHouse, { observe: 'response' });
  }

  partialUpdate(sMEHouse: ISMEHouse): Observable<EntityResponseType> {
    return this.http.patch<ISMEHouse>(`${this.resourceUrl}/${getSMEHouseIdentifier(sMEHouse) as number}`, sMEHouse, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISMEHouse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISMEHouse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSMEHouseToCollectionIfMissing(sMEHouseCollection: ISMEHouse[], ...sMEHousesToCheck: (ISMEHouse | null | undefined)[]): ISMEHouse[] {
    const sMEHouses: ISMEHouse[] = sMEHousesToCheck.filter(isPresent);
    if (sMEHouses.length > 0) {
      const sMEHouseCollectionIdentifiers = sMEHouseCollection.map(sMEHouseItem => getSMEHouseIdentifier(sMEHouseItem)!);
      const sMEHousesToAdd = sMEHouses.filter(sMEHouseItem => {
        const sMEHouseIdentifier = getSMEHouseIdentifier(sMEHouseItem);
        if (sMEHouseIdentifier == null || sMEHouseCollectionIdentifiers.includes(sMEHouseIdentifier)) {
          return false;
        }
        sMEHouseCollectionIdentifiers.push(sMEHouseIdentifier);
        return true;
      });
      return [...sMEHousesToAdd, ...sMEHouseCollection];
    }
    return sMEHouseCollection;
  }
}
