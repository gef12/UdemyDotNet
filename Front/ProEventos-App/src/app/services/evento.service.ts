import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable()
//injentado dependecias do service evento tem 3 maneiras no componete, no app.module e aqui
//{providedIn: 'root',}
export class EventoService {
  baseURL = 'https://localhost:5001/api/eventos';
  constructor(private http: HttpClient) {}

  public getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseURL);
  }
  public getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`);
  }
  public getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }
  //parte 1 antes da refatoração
  public postEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseURL, evento);
  }

  public putEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseURL}/${id}`, evento);
  }

  //parte 1 final  antes da refatoração

  public post(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseURL, evento);
  }

  public put(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseURL}/${evento.id}`, evento);
  }
  public deleteEvento(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}`);
  }
}
