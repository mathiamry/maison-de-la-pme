import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAppointmentObject, getAppointmentObjectIdentifier } from '../appointment-object.model';

export type EntityResponseType = HttpResponse<IAppointmentObject>;
export type EntityArrayResponseType = HttpResponse<IAppointmentObject[]>;

@Injectable({ providedIn: 'root' })
export class AppointmentObjectService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/appointment-objects');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(appointmentObject: IAppointmentObject): Observable<EntityResponseType> {
    return this.http.post<IAppointmentObject>(this.resourceUrl, appointmentObject, { observe: 'response' });
  }

  update(appointmentObject: IAppointmentObject): Observable<EntityResponseType> {
    return this.http.put<IAppointmentObject>(
      `${this.resourceUrl}/${getAppointmentObjectIdentifier(appointmentObject) as number}`,
      appointmentObject,
      { observe: 'response' }
    );
  }

  partialUpdate(appointmentObject: IAppointmentObject): Observable<EntityResponseType> {
    return this.http.patch<IAppointmentObject>(
      `${this.resourceUrl}/${getAppointmentObjectIdentifier(appointmentObject) as number}`,
      appointmentObject,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAppointmentObject>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAppointmentObject[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAppointmentObjectToCollectionIfMissing(
    appointmentObjectCollection: IAppointmentObject[],
    ...appointmentObjectsToCheck: (IAppointmentObject | null | undefined)[]
  ): IAppointmentObject[] {
    const appointmentObjects: IAppointmentObject[] = appointmentObjectsToCheck.filter(isPresent);
    if (appointmentObjects.length > 0) {
      const appointmentObjectCollectionIdentifiers = appointmentObjectCollection.map(
        appointmentObjectItem => getAppointmentObjectIdentifier(appointmentObjectItem)!
      );
      const appointmentObjectsToAdd = appointmentObjects.filter(appointmentObjectItem => {
        const appointmentObjectIdentifier = getAppointmentObjectIdentifier(appointmentObjectItem);
        if (appointmentObjectIdentifier == null || appointmentObjectCollectionIdentifiers.includes(appointmentObjectIdentifier)) {
          return false;
        }
        appointmentObjectCollectionIdentifiers.push(appointmentObjectIdentifier);
        return true;
      });
      return [...appointmentObjectsToAdd, ...appointmentObjectCollection];
    }
    return appointmentObjectCollection;
  }
}
