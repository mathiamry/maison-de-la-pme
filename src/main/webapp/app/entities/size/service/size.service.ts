import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISize, getSizeIdentifier } from '../size.model';

export type EntityResponseType = HttpResponse<ISize>;
export type EntityArrayResponseType = HttpResponse<ISize[]>;

@Injectable({ providedIn: 'root' })
export class SizeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sizes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(size: ISize): Observable<EntityResponseType> {
    return this.http.post<ISize>(this.resourceUrl, size, { observe: 'response' });
  }

  update(size: ISize): Observable<EntityResponseType> {
    return this.http.put<ISize>(`${this.resourceUrl}/${getSizeIdentifier(size) as number}`, size, { observe: 'response' });
  }

  partialUpdate(size: ISize): Observable<EntityResponseType> {
    return this.http.patch<ISize>(`${this.resourceUrl}/${getSizeIdentifier(size) as number}`, size, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISize>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISize[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSizeToCollectionIfMissing(sizeCollection: ISize[], ...sizesToCheck: (ISize | null | undefined)[]): ISize[] {
    const sizes: ISize[] = sizesToCheck.filter(isPresent);
    if (sizes.length > 0) {
      const sizeCollectionIdentifiers = sizeCollection.map(sizeItem => getSizeIdentifier(sizeItem)!);
      const sizesToAdd = sizes.filter(sizeItem => {
        const sizeIdentifier = getSizeIdentifier(sizeItem);
        if (sizeIdentifier == null || sizeCollectionIdentifiers.includes(sizeIdentifier)) {
          return false;
        }
        sizeCollectionIdentifiers.push(sizeIdentifier);
        return true;
      });
      return [...sizesToAdd, ...sizeCollection];
    }
    return sizeCollection;
  }
}
