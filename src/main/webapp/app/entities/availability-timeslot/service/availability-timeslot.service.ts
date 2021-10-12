import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAvailabilityTimeslot, getAvailabilityTimeslotIdentifier } from '../availability-timeslot.model';

export type EntityResponseType = HttpResponse<IAvailabilityTimeslot>;
export type EntityArrayResponseType = HttpResponse<IAvailabilityTimeslot[]>;

@Injectable({ providedIn: 'root' })
export class AvailabilityTimeslotService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/availability-timeslots');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(availabilityTimeslot: IAvailabilityTimeslot): Observable<EntityResponseType> {
    return this.http.post<IAvailabilityTimeslot>(this.resourceUrl, availabilityTimeslot, { observe: 'response' });
  }

  update(availabilityTimeslot: IAvailabilityTimeslot): Observable<EntityResponseType> {
    return this.http.put<IAvailabilityTimeslot>(
      `${this.resourceUrl}/${getAvailabilityTimeslotIdentifier(availabilityTimeslot) as number}`,
      availabilityTimeslot,
      { observe: 'response' }
    );
  }

  partialUpdate(availabilityTimeslot: IAvailabilityTimeslot): Observable<EntityResponseType> {
    return this.http.patch<IAvailabilityTimeslot>(
      `${this.resourceUrl}/${getAvailabilityTimeslotIdentifier(availabilityTimeslot) as number}`,
      availabilityTimeslot,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAvailabilityTimeslot>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAvailabilityTimeslot[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAvailabilityTimeslotToCollectionIfMissing(
    availabilityTimeslotCollection: IAvailabilityTimeslot[],
    ...availabilityTimeslotsToCheck: (IAvailabilityTimeslot | null | undefined)[]
  ): IAvailabilityTimeslot[] {
    const availabilityTimeslots: IAvailabilityTimeslot[] = availabilityTimeslotsToCheck.filter(isPresent);
    if (availabilityTimeslots.length > 0) {
      const availabilityTimeslotCollectionIdentifiers = availabilityTimeslotCollection.map(
        availabilityTimeslotItem => getAvailabilityTimeslotIdentifier(availabilityTimeslotItem)!
      );
      const availabilityTimeslotsToAdd = availabilityTimeslots.filter(availabilityTimeslotItem => {
        const availabilityTimeslotIdentifier = getAvailabilityTimeslotIdentifier(availabilityTimeslotItem);
        if (availabilityTimeslotIdentifier == null || availabilityTimeslotCollectionIdentifiers.includes(availabilityTimeslotIdentifier)) {
          return false;
        }
        availabilityTimeslotCollectionIdentifiers.push(availabilityTimeslotIdentifier);
        return true;
      });
      return [...availabilityTimeslotsToAdd, ...availabilityTimeslotCollection];
    }
    return availabilityTimeslotCollection;
  }
}
