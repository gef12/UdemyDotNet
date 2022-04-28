import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResult } from '@app/models/Pagination';
import { map, Observable, take } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()
//injentado dependecias do service evento tem 3 maneiras no componete, no app.module e aqui
//{providedIn: 'root',}
export class EventoService {
  baseURL = 'https://localhost:5001/api/eventos';

  // tokenHeader = new HttpHeaders({
  //   Authorization: `Bearer ${
  //     JSON.parse(localStorage.getItem('user') || '{}').token
  //   }`,
  // });
  constructor(private http: HttpClient) {}

  public getEventos(
    page?: number,
    itemsPerPage?: number,
    term?: string
  ): Observable<PaginatedResult<Evento[]>> {
    const paginatedResult: PaginatedResult<Evento[]> = new PaginatedResult<
      Evento[]
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
      .get<Evento[]>(this.baseURL, { observe: 'response', params })
      .pipe(
        take(1),
        map((response) => {
          paginatedResult.result = response.body as Evento[];
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
  // public getEventosByTema(tema: string): Observable<Evento[]> {
  //   return this.http
  //     .get<Evento[]>(`${this.baseURL}/${tema}/tema`)
  //     .pipe(take(1));
  // }
  public getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`).pipe(take(1));
  }
  //parte 1 antes da refatoração
  public postEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseURL, evento).pipe(take(1)); //pipe(take(1))  posibilita fazer a unsubscribe quando ocorrer o numero de tentativas estabelecida
    //e uma opção para não preecisar fazer no metodo
  }

  public putEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseURL}/${id}`, evento).pipe(take(1));
  }

  //parte 1 final  antes da refatoração

  public post(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseURL, evento).pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento> {
    return this.http
      .put<Evento>(`${this.baseURL}/${evento.id}`, evento)
      .pipe(take(1));
  }
  public deleteEvento(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}`).pipe(take(1));
  }

  postUpload(eventoId: number, file: FileList): Observable<Evento> {
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http
      .post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData)
      .pipe(take(1));
  }
}
