import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()
//injentado dependecias do service evento tem 3 maneiras no componete, no app.module e aqui
//{providedIn: 'root',}
export class EventoService {
  baseURL = 'https://localhost:5001/api/eventos';
  constructor(private http: HttpClient) {}

  public getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseURL).pipe(take(1));
  }
  public getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http
      .get<Evento[]>(`${this.baseURL}/${tema}/tema`)
      .pipe(take(1));
  }
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
}
