import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExperience, getExperienceIdentifier } from '../experience.model';

export type EntityResponseType = HttpResponse<IExperience>;
export type EntityArrayResponseType = HttpResponse<IExperience[]>;

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/experiences');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(experience: IExperience): Observable<EntityResponseType> {
    return this.http.post<IExperience>(this.resourceUrl, experience, { observe: 'response' });
  }

  update(experience: IExperience): Observable<EntityResponseType> {
    return this.http.put<IExperience>(`${this.resourceUrl}/${getExperienceIdentifier(experience) as number}`, experience, {
      observe: 'response',
    });
  }

  partialUpdate(experience: IExperience): Observable<EntityResponseType> {
    return this.http.patch<IExperience>(`${this.resourceUrl}/${getExperienceIdentifier(experience) as number}`, experience, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExperience>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExperience[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExperienceToCollectionIfMissing(
    experienceCollection: IExperience[],
    ...experiencesToCheck: (IExperience | null | undefined)[]
  ): IExperience[] {
    const experiences: IExperience[] = experiencesToCheck.filter(isPresent);
    if (experiences.length > 0) {
      const experienceCollectionIdentifiers = experienceCollection.map(experienceItem => getExperienceIdentifier(experienceItem)!);
      const experiencesToAdd = experiences.filter(experienceItem => {
        const experienceIdentifier = getExperienceIdentifier(experienceItem);
        if (experienceIdentifier == null || experienceCollectionIdentifiers.includes(experienceIdentifier)) {
          return false;
        }
        experienceCollectionIdentifiers.push(experienceIdentifier);
        return true;
      });
      return [...experiencesToAdd, ...experienceCollection];
    }
    return experienceCollection;
  }
}
