import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHistory, getHistoryIdentifier } from '../history.model';

export type EntityResponseType = HttpResponse<IHistory>;
export type EntityArrayResponseType = HttpResponse<IHistory[]>;

@Injectable({ providedIn: 'root' })
export class HistoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/histories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(history: IHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(history);
    return this.http
      .post<IHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(history: IHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(history);
    return this.http
      .put<IHistory>(`${this.resourceUrl}/${getHistoryIdentifier(history) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(history: IHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(history);
    return this.http
      .patch<IHistory>(`${this.resourceUrl}/${getHistoryIdentifier(history) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHistoryToCollectionIfMissing(historyCollection: IHistory[], ...historiesToCheck: (IHistory | null | undefined)[]): IHistory[] {
    const histories: IHistory[] = historiesToCheck.filter(isPresent);
    if (histories.length > 0) {
      const historyCollectionIdentifiers = historyCollection.map(historyItem => getHistoryIdentifier(historyItem)!);
      const historiesToAdd = histories.filter(historyItem => {
        const historyIdentifier = getHistoryIdentifier(historyItem);
        if (historyIdentifier == null || historyCollectionIdentifiers.includes(historyIdentifier)) {
          return false;
        }
        historyCollectionIdentifiers.push(historyIdentifier);
        return true;
      });
      return [...historiesToAdd, ...historyCollection];
    }
    return historyCollection;
  }

  protected convertDateFromClient(history: IHistory): IHistory {
    return Object.assign({}, history, {
      actionDate: history.actionDate?.isValid() ? history.actionDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.actionDate = res.body.actionDate ? dayjs(res.body.actionDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((history: IHistory) => {
        history.actionDate = history.actionDate ? dayjs(history.actionDate) : undefined;
      });
    }
    return res;
  }
}
