import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Pagination, PaginatedResult } from '@app/models/Pagination';
import { environment } from '@environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounce, debounceTime, Subject } from 'rxjs';
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
  public eventoId = 0;

  public pagination = {} as Pagination;

  public widthImg: number = 150;
  public marginImg: number = 2;
  public mostrarImg = true;

  termoBuscaChanged: Subject<string> = new Subject<string>();
  // private _filtroLista: string = '';

  // public get filtroLista(): string {
  //   return this._filtroLista;
  // }

  // public set filtroLista(value: string) {
  //   this._filtroLista = value;
  //   this.eventosFiltrados = this.filtroLista
  //     ? this.filtrarEventos(this.filtroLista)
  //     : this.eventos;
  // }

  public filtrarEventos(evt: any): void {
    console.log(evt.value);

    if (this.termoBuscaChanged.asObservable.length === 0) {
      this.termoBuscaChanged
        .pipe(debounceTime(1000))
        .subscribe((filtrarPor) => {
          this.spinner.show();
          this.eventoService
            .getEventos(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
              //vt.value
            )
            .subscribe(
              (paginatedResult: PaginatedResult<Evento[]>) => {
                this.eventos = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
              },
              (error: any) => {
                this.spinner.hide(),
                  this.toastr.error('Erro ao carrear os eventos', 'Erro!');
              }
            )
            .add(() => this.spinner.hide());
        });
      this.termoBuscaChanged.next(evt.value);
    }
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
    } as Pagination;

    this.carregarEventos();
  }

  public alterarImg(): void {
    this.mostrarImg = !this.mostrarImg;
  }

  public mostraImagem(imagemURL: string): string {
    return imagemURL !== ''
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/img/semImagem.jpeg';
  }

  public carregarEventos(): void {
    this.spinner.show();
    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (paginatedResult: PaginatedResult<Evento[]>) => {
          this.eventos = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
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

  //refatorando pra usar o .add( () => this.spinner.hide());
  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.eventoService
      .deleteEvento(this.eventoId)
      .subscribe(
        (result: string) => {
          this.toastr.success(' Evento foi deletado com sucesso!', 'Deletado!');
          //this.spinner.hide();
          this.carregarEventos();
        },
        (error: any) => {
          console.error(error);
          this.toastr.error(
            `Erro ao tentar apagar o evento ${this.eventoId}`,
            'Erro'
          );
        }
        //() => {
        //  this.spinner.hide();
        //}
      )
      .add(() => this.spinner.hide()); //o uso do add adicionar o show toda avez que ele sai do error, sucess
    this.toastr.success(' Evento foi deletado com sucesso!', 'Deletado!');
  }

  decline(): void {
    this.modalRef?.hide();
  }

  public pageChanged(event: { page: number }): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
  }
}
