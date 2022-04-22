import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lote } from '@app/models/Lote';
import { Observable, take } from 'rxjs';

@Injectable()
export class LoteService {
  baseURL = 'https://localhost:5001/api/lotes';
  constructor(private http: HttpClient) {}

  public getLotesByEventoId(eventoId: number): Observable<Lote[]> {
    return this.http.get<Lote[]>(`${this.baseURL}/${eventoId}`).pipe(take(1));
  }
  //parte 1 antes da refatoração

  public saveLote(eventoId: number, lotes: Lote[]): Observable<Lote[]> {
    return this.http
      .put<Lote[]>(`${this.baseURL}/${eventoId}`, lotes)
      .pipe(take(1));
  }

  //parte 1 final  antes da refatoração

  public post(lote: Lote): Observable<Lote> {
    return this.http.post<Lote>(this.baseURL, lote).pipe(take(1));
  }

  public put(lote: Lote): Observable<Lote> {
    return this.http
      .put<Lote>(`${this.baseURL}/${lote.id}`, lote)
      .pipe(take(1));
  }
  public deleteLote(eventoId: number, loteId: number): Observable<any> {
    return this.http
      .delete(`${this.baseURL}/${eventoId}/${loteId}`)
      .pipe(take(1));
  }
}
