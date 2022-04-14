import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  form: FormGroup | any;

  evento = {} as Evento;

  //variavel para controlar se e para salvar ou atulaizar
  estadoSalvar = 'post' as string;

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }
  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private router: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if (eventoIdParam !== null) {
      this.estadoSalvar = 'put'; //variavel de controle para update
      this.spinner.show();
      //+ converte para int
      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        // next: () =>{},
        // error: () =>{},
        // complete: () =>{},
        (evento: Evento) => {
          //uma forma de fazer
          //this.evento = Object.assign({}, evento);
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar evento.', 'Erro!');
          console.error(error);
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      local: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      dataEvento: ['', Validators.required],
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemURL: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {
      if (this.estadoSalvar === 'post') {
        this.evento = { ...this.form.value };
        this.eventoService.postEvento(this.evento).subscribe(
          () => {
            this.toastr.success('Evento salvo com sucesso.', 'Sucesso');
          },
          (error: any) => {
            console.error(error);
            this.spinner.hide();
            this.toastr.error('Erro ao salvar evento', 'Erro');
          },
          () => {
            this.spinner.hide();
          }
        );
      } else {
        this.evento = { id: this.evento.id, ...this.form.value };
        this.eventoService.putEvento(this.evento.id, this.evento).subscribe(
          () => {
            this.toastr.success('Evento atualizado com sucesso.', 'Sucesso');
          },
          (error: any) => {
            console.error(error);
            this.spinner.hide();
            this.toastr.error('Erro ao atualizar evento', 'Erro');
          },
          () => {
            this.spinner.hide();
          }
        );
      }
    }
  }

  // outra forma de fazer utilizando uma variavel que indica se e put ou post lembrando que muda em vez de enviar o evento id
  //so envia o evento no put
  // public salvarAlteracao(): void {
  //   this.spinner.show();
  //   if (this.form.valid) {
  //     //ternario
  //     this.evento =
  //       this.estadoSalvar === 'post'
  //         ? (this.evento = { ...this.form.value })
  //         : (this.evento = { id: this.evento.id, ...this.form.value });

  //     this.eventoService[this.estadoSalvar](this.evento).subscribe(
  //       () => {
  //         this.toastr.success('Evento salvo com sucesso.', 'Sucesso');
  //       },
  //       (error: any) => {
  //         console.error(error);
  //         this.spinner.hide();
  //         this.toastr.error('Erro ao salvar evento', 'Erro');
  //       },
  //       () => {
  //         this.spinner.hide();
  //       }
  //     );
  //   }
  // }
}
