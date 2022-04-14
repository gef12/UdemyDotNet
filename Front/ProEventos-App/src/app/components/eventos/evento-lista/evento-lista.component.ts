import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss'],
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public eventoId = 0;

  public widthImg: number = 150;
  public marginImg: number = 2;
  public mostrarImg = true;
  private _filtroLista: string = '';

  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: any) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.spinner.show();
    this.carregarEventos();
  }

  public alterarImg(): void {
    this.mostrarImg = !this.mostrarImg;
  }

  public carregarEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.spinner.hide(),
          this.toastr.error('Erro ao carrear os eventos', 'Erro!');
      },
      complete: () => this.spinner.hide(),
    });
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

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

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: string) => {
        this.toastr.success(' Evento foi deletado com sucesso!', 'Deletado!');
        this.spinner.hide();
        this.carregarEventos();
      },
      (error: any) => {
        console.error(error);
        this.toastr.error(
          `Erro ao tentar apagar o evento ${this.eventoId}`,
          'Erro'
        );
      },
      () => {
        this.spinner.hide();
      }
    );
    this.toastr.success(' Evento foi deletado com sucesso!', 'Deletado!');
  }

  decline(): void {
    this.modalRef?.hide();
  }
}
