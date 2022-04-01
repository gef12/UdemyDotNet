import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  public eventos: any = [];
  widthImg: number = 150;
  marginImg: number = 2;
  mostrarImg = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getEventos();
  }

  alterarImg() {
    this.mostrarImg = !this.mostrarImg;
  }

  public getEventos(): void {
    this.http.get('https://localhost:5001/api/eventos').subscribe(
      (response) => (this.eventos = response),
      (error) => console.log(error)
    );

    /**
    this.eventos = [
      {
        Tema: 'Angular 11',
        Local: 'BH',
      },
      {
        Tema: 'Angular 12',
        Local: 'RJ',
      },
      {
        Tema: 'Angular 13',
        Local: 'SP',
      },
    ];
      */
  }
}
