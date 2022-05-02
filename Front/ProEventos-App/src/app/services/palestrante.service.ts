import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResult } from '@app/models/Pagination';
import { Palestrante } from '@app/models/Palestrante';
import { environment } from '@environments/environment';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PalestranteService {
  baseURL = environment.apiURL + 'api/palestrantes';

  // tokenHeader = new HttpHeaders({
  //   Authorization: `Bearer ${
  //     JSON.parse(localStorage.getItem('user') || '{}').token
  //   }`,
  // });
  constructor(private http: HttpClient) {}

  public getPalestrantes(
    page?: number,
    itemsPerPage?: number,
    term?: string
  ): Observable<PaginatedResult<Palestrante[]>> {
    const paginatedResult: PaginatedResult<Palestrante[]> = new PaginatedResult<
      Palestrante[]
    >();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    if (term != null && term != '') {
      //console.log('tema: ', params.get('term'));
      params = params.append('term', term);
    }

    return this.http
      .get<Palestrante[]>(this.baseURL + '/all', {
        observe: 'response',
        params,
      })
      .pipe(
        take(1),
        map((response) => {
          paginatedResult.result = response.body as Palestrante[];
          if (response.headers.has('Pagination')) {
            //const aux = response.headers.get('Pagination') != null ?  response.headers.get('Pagination') : ''
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination') + ''
            );
          }
          return paginatedResult;
        })
      );
  }
  // public getPalestrantesByTema(tema: string): Observable<Palestrante[]> {
  //   return this.http
  //     .get<Palestrante[]>(`${this.baseURL}/${tema}/tema`)
  //     .pipe(take(1));
  // }
  public getPalestrante(): Observable<Palestrante> {
    return this.http.get<Palestrante>(`${this.baseURL}`).pipe(take(1));
  }
  //parte 1 antes da refatoração
  public postPalestrante(palestrante: Palestrante): Observable<Palestrante> {
    return this.http.post<Palestrante>(this.baseURL, palestrante).pipe(take(1)); //pipe(take(1))  posibilita fazer a unsubscribe quando ocorrer o numero de tentativas estabelecida
    //e uma opção para não preecisar fazer no metodo
  }

  public putPalestrante(
    id: number,
    palestrante: Palestrante
  ): Observable<Palestrante> {
    return this.http
      .put<Palestrante>(`${this.baseURL}/${id}`, palestrante)
      .pipe(take(1));
  }

  //parte 1 final  antes da refatoração

  public post(): Observable<Palestrante> {
    return this.http
      .post<Palestrante>(this.baseURL, {} as Palestrante)
      .pipe(take(1));
  }

  public put(palestrante: Palestrante): Observable<Palestrante> {
    return this.http
      .put<Palestrante>(`${this.baseURL}`, palestrante)
      .pipe(take(1));
  }
  // public deletePalestrante(id: number): Observable<any> {
  //   return this.http.delete(`${this.baseURL}/${id}`).pipe(take(1));
  // }
}
