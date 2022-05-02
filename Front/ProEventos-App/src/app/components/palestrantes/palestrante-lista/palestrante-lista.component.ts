import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { environment } from '@environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss'],
})
export class PalestranteListaComponent implements OnInit {
  public pagination = {} as Pagination;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  public palestrantes: Palestrante[] = [];

  constructor(
    private palestranteService: PalestranteService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
    } as Pagination;

    this.carregarPalestrantes();
  }

  public filtrarPalestrantes(evt: any): void {
    console.log(evt.value);

    if (this.termoBuscaChanged.asObservable.length === 0) {
      this.termoBuscaChanged
        .pipe(debounceTime(1000))
        .subscribe((filtrarPor) => {
          this.spinner.show();
          this.palestranteService
            .getPalestrantes(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
              //vt.value
            )
            .subscribe(
              (paginatedResult: PaginatedResult<Palestrante[]>) => {
                this.palestrantes = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
              },
              (error: any) => {
                this.spinner.hide(),
                  this.toastr.error('Erro ao carrear os palestrantes', 'Erro!');
              }
            )
            .add(() => this.spinner.hide());
        });
      this.termoBuscaChanged.next(evt.value);
    }
  }

  public carregarPalestrantes(): void {
    this.spinner.show();
    this.palestranteService
      .getPalestrantes(
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .subscribe({
        next: (paginatedResult: PaginatedResult<Palestrante[]>) => {
          this.palestrantes = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        },
        error: (error: any) => {
          this.spinner.hide(),
            this.toastr.error('Erro ao carrear os palestrante', 'Erro!');
        },
        complete: () => this.spinner.hide(),
      });
  }

  public getImagemURL(imageName: string): string {
    if (imageName) return environment.apiURL + `Resources/perfil/${imageName}`;
    else return environment.apiURL + 'assets/img/perfil.png';
  }
}
