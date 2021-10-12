import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITender, getTenderIdentifier } from '../tender.model';

export type EntityResponseType = HttpResponse<ITender>;
export type EntityArrayResponseType = HttpResponse<ITender[]>;

@Injectable({ providedIn: 'root' })
export class TenderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tenders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tender: ITender): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tender);
    return this.http
      .post<ITender>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(tender: ITender): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tender);
    return this.http
      .put<ITender>(`${this.resourceUrl}/${getTenderIdentifier(tender) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(tender: ITender): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tender);
    return this.http
      .patch<ITender>(`${this.resourceUrl}/${getTenderIdentifier(tender) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITender>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITender[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTenderToCollectionIfMissing(tenderCollection: ITender[], ...tendersToCheck: (ITender | null | undefined)[]): ITender[] {
    const tenders: ITender[] = tendersToCheck.filter(isPresent);
    if (tenders.length > 0) {
      const tenderCollectionIdentifiers = tenderCollection.map(tenderItem => getTenderIdentifier(tenderItem)!);
      const tendersToAdd = tenders.filter(tenderItem => {
        const tenderIdentifier = getTenderIdentifier(tenderItem);
        if (tenderIdentifier == null || tenderCollectionIdentifiers.includes(tenderIdentifier)) {
          return false;
        }
        tenderCollectionIdentifiers.push(tenderIdentifier);
        return true;
      });
      return [...tendersToAdd, ...tenderCollection];
    }
    return tenderCollection;
  }

  protected convertDateFromClient(tender: ITender): ITender {
    return Object.assign({}, tender, {
      publishDate: tender.publishDate?.isValid() ? tender.publishDate.toJSON() : undefined,
      expiryDate: tender.expiryDate?.isValid() ? tender.expiryDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.publishDate = res.body.publishDate ? dayjs(res.body.publishDate) : undefined;
      res.body.expiryDate = res.body.expiryDate ? dayjs(res.body.expiryDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((tender: ITender) => {
        tender.publishDate = tender.publishDate ? dayjs(tender.publishDate) : undefined;
        tender.expiryDate = tender.expiryDate ? dayjs(tender.expiryDate) : undefined;
      });
    }
    return res;
  }
}
