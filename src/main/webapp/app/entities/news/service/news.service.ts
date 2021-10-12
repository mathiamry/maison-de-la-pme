import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INews, getNewsIdentifier } from '../news.model';

export type EntityResponseType = HttpResponse<INews>;
export type EntityArrayResponseType = HttpResponse<INews[]>;

@Injectable({ providedIn: 'root' })
export class NewsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/news');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(news: INews): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(news);
    return this.http
      .post<INews>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(news: INews): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(news);
    return this.http
      .put<INews>(`${this.resourceUrl}/${getNewsIdentifier(news) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(news: INews): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(news);
    return this.http
      .patch<INews>(`${this.resourceUrl}/${getNewsIdentifier(news) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<INews>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INews[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNewsToCollectionIfMissing(newsCollection: INews[], ...newsToCheck: (INews | null | undefined)[]): INews[] {
    const news: INews[] = newsToCheck.filter(isPresent);
    if (news.length > 0) {
      const newsCollectionIdentifiers = newsCollection.map(newsItem => getNewsIdentifier(newsItem)!);
      const newsToAdd = news.filter(newsItem => {
        const newsIdentifier = getNewsIdentifier(newsItem);
        if (newsIdentifier == null || newsCollectionIdentifiers.includes(newsIdentifier)) {
          return false;
        }
        newsCollectionIdentifiers.push(newsIdentifier);
        return true;
      });
      return [...newsToAdd, ...newsCollection];
    }
    return newsCollection;
  }

  protected convertDateFromClient(news: INews): INews {
    return Object.assign({}, news, {
      createdAt: news.createdAt?.isValid() ? news.createdAt.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdAt = res.body.createdAt ? dayjs(res.body.createdAt) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((news: INews) => {
        news.createdAt = news.createdAt ? dayjs(news.createdAt) : undefined;
      });
    }
    return res;
  }
}
