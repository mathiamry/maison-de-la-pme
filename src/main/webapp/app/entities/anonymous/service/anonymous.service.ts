import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnonymous, getAnonymousIdentifier } from '../anonymous.model';

export type EntityResponseType = HttpResponse<IAnonymous>;
export type EntityArrayResponseType = HttpResponse<IAnonymous[]>;

@Injectable({ providedIn: 'root' })
export class AnonymousService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/anonymous');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(anonymous: IAnonymous): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(anonymous);
    return this.http
      .post<IAnonymous>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(anonymous: IAnonymous): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(anonymous);
    return this.http
      .put<IAnonymous>(`${this.resourceUrl}/${getAnonymousIdentifier(anonymous) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(anonymous: IAnonymous): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(anonymous);
    return this.http
      .patch<IAnonymous>(`${this.resourceUrl}/${getAnonymousIdentifier(anonymous) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAnonymous>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAnonymous[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAnonymousToCollectionIfMissing(
    anonymousCollection: IAnonymous[],
    ...anonymousToCheck: (IAnonymous | null | undefined)[]
  ): IAnonymous[] {
    const anonymous: IAnonymous[] = anonymousToCheck.filter(isPresent);
    if (anonymous.length > 0) {
      const anonymousCollectionIdentifiers = anonymousCollection.map(anonymousItem => getAnonymousIdentifier(anonymousItem)!);
      const anonymousToAdd = anonymous.filter(anonymousItem => {
        const anonymousIdentifier = getAnonymousIdentifier(anonymousItem);
        if (anonymousIdentifier == null || anonymousCollectionIdentifiers.includes(anonymousIdentifier)) {
          return false;
        }
        anonymousCollectionIdentifiers.push(anonymousIdentifier);
        return true;
      });
      return [...anonymousToAdd, ...anonymousCollection];
    }
    return anonymousCollection;
  }

  protected convertDateFromClient(anonymous: IAnonymous): IAnonymous {
    return Object.assign({}, anonymous, {
      visitDate: anonymous.visitDate?.isValid() ? anonymous.visitDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.visitDate = res.body.visitDate ? dayjs(res.body.visitDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((anonymous: IAnonymous) => {
        anonymous.visitDate = anonymous.visitDate ? dayjs(anonymous.visitDate) : undefined;
      });
    }
    return res;
  }
}
