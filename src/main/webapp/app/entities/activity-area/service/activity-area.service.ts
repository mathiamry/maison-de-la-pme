import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActivityArea, getActivityAreaIdentifier } from '../activity-area.model';

export type EntityResponseType = HttpResponse<IActivityArea>;
export type EntityArrayResponseType = HttpResponse<IActivityArea[]>;

@Injectable({ providedIn: 'root' })
export class ActivityAreaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/activity-areas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(activityArea: IActivityArea): Observable<EntityResponseType> {
    return this.http.post<IActivityArea>(this.resourceUrl, activityArea, { observe: 'response' });
  }

  update(activityArea: IActivityArea): Observable<EntityResponseType> {
    return this.http.put<IActivityArea>(`${this.resourceUrl}/${getActivityAreaIdentifier(activityArea) as number}`, activityArea, {
      observe: 'response',
    });
  }

  partialUpdate(activityArea: IActivityArea): Observable<EntityResponseType> {
    return this.http.patch<IActivityArea>(`${this.resourceUrl}/${getActivityAreaIdentifier(activityArea) as number}`, activityArea, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActivityArea>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActivityArea[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addActivityAreaToCollectionIfMissing(
    activityAreaCollection: IActivityArea[],
    ...activityAreasToCheck: (IActivityArea | null | undefined)[]
  ): IActivityArea[] {
    const activityAreas: IActivityArea[] = activityAreasToCheck.filter(isPresent);
    if (activityAreas.length > 0) {
      const activityAreaCollectionIdentifiers = activityAreaCollection.map(
        activityAreaItem => getActivityAreaIdentifier(activityAreaItem)!
      );
      const activityAreasToAdd = activityAreas.filter(activityAreaItem => {
        const activityAreaIdentifier = getActivityAreaIdentifier(activityAreaItem);
        if (activityAreaIdentifier == null || activityAreaCollectionIdentifiers.includes(activityAreaIdentifier)) {
          return false;
        }
        activityAreaCollectionIdentifiers.push(activityAreaIdentifier);
        return true;
      });
      return [...activityAreasToAdd, ...activityAreaCollection];
    }
    return activityAreaCollection;
  }
}
