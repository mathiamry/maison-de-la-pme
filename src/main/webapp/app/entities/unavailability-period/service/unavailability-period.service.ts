import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUnavailabilityPeriod, getUnavailabilityPeriodIdentifier } from '../unavailability-period.model';

export type EntityResponseType = HttpResponse<IUnavailabilityPeriod>;
export type EntityArrayResponseType = HttpResponse<IUnavailabilityPeriod[]>;

@Injectable({ providedIn: 'root' })
export class UnavailabilityPeriodService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/unavailability-periods');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(unavailabilityPeriod: IUnavailabilityPeriod): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(unavailabilityPeriod);
    return this.http
      .post<IUnavailabilityPeriod>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(unavailabilityPeriod: IUnavailabilityPeriod): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(unavailabilityPeriod);
    return this.http
      .put<IUnavailabilityPeriod>(`${this.resourceUrl}/${getUnavailabilityPeriodIdentifier(unavailabilityPeriod) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(unavailabilityPeriod: IUnavailabilityPeriod): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(unavailabilityPeriod);
    return this.http
      .patch<IUnavailabilityPeriod>(`${this.resourceUrl}/${getUnavailabilityPeriodIdentifier(unavailabilityPeriod) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IUnavailabilityPeriod>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUnavailabilityPeriod[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUnavailabilityPeriodToCollectionIfMissing(
    unavailabilityPeriodCollection: IUnavailabilityPeriod[],
    ...unavailabilityPeriodsToCheck: (IUnavailabilityPeriod | null | undefined)[]
  ): IUnavailabilityPeriod[] {
    const unavailabilityPeriods: IUnavailabilityPeriod[] = unavailabilityPeriodsToCheck.filter(isPresent);
    if (unavailabilityPeriods.length > 0) {
      const unavailabilityPeriodCollectionIdentifiers = unavailabilityPeriodCollection.map(
        unavailabilityPeriodItem => getUnavailabilityPeriodIdentifier(unavailabilityPeriodItem)!
      );
      const unavailabilityPeriodsToAdd = unavailabilityPeriods.filter(unavailabilityPeriodItem => {
        const unavailabilityPeriodIdentifier = getUnavailabilityPeriodIdentifier(unavailabilityPeriodItem);
        if (unavailabilityPeriodIdentifier == null || unavailabilityPeriodCollectionIdentifiers.includes(unavailabilityPeriodIdentifier)) {
          return false;
        }
        unavailabilityPeriodCollectionIdentifiers.push(unavailabilityPeriodIdentifier);
        return true;
      });
      return [...unavailabilityPeriodsToAdd, ...unavailabilityPeriodCollection];
    }
    return unavailabilityPeriodCollection;
  }

  protected convertDateFromClient(unavailabilityPeriod: IUnavailabilityPeriod): IUnavailabilityPeriod {
    return Object.assign({}, unavailabilityPeriod, {
      startTime: unavailabilityPeriod.startTime?.isValid() ? unavailabilityPeriod.startTime.toJSON() : undefined,
      endTime: unavailabilityPeriod.endTime?.isValid() ? unavailabilityPeriod.endTime.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startTime = res.body.startTime ? dayjs(res.body.startTime) : undefined;
      res.body.endTime = res.body.endTime ? dayjs(res.body.endTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((unavailabilityPeriod: IUnavailabilityPeriod) => {
        unavailabilityPeriod.startTime = unavailabilityPeriod.startTime ? dayjs(unavailabilityPeriod.startTime) : undefined;
        unavailabilityPeriod.endTime = unavailabilityPeriod.endTime ? dayjs(unavailabilityPeriod.endTime) : undefined;
      });
    }
    return res;
  }
}
