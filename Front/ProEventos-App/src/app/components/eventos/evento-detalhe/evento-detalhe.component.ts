import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  form: FormGroup | any;
  modalRef?: BsModalRef;

  evento = {} as Evento;

  eventoId: number | any;

  loteAtual = { id: 0, nome: '', indice: 0 };

  //variavel para controlar se e para salvar ou atulaizar
  estadoSalvar = 'post' as string;

  get modoEditar(): boolean {
    return this.estadoSalvar == 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

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

  retornaTituloNome(value: string): string {
    return value === null || value === '' ? 'Nome do Lote' : value;
  }
  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    this.eventoId = this.activatedRouter.snapshot.paramMap.get('id');
    //modificado para não pegar nulo
    //this.eventoId = +this.activatedRouter.snapshot.params['id'];

    console.log(this.activatedRouter.snapshot.paramMap.get('id'));

    if (this.eventoId !== null && this.eventoId !== 0) {
      this.estadoSalvar = 'put'; //variavel de controle para update
      this.spinner.show();
      //+ converte para int
      this.eventoService.getEventoById(this.eventoId).subscribe(
        // next: () =>{},
        // error: () =>{},
        // complete: () =>{},
        (evento: Evento) => {
          //uma forma de fazer
          //this.evento = Object.assign({}, evento);
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
          //duas forma de fazer esta vc ja possui os lotes no evento então basta carregar
          //a outra usa chamar um metodo
          //this.carregarLotes();

          this.evento.lotes.forEach((lote) => {
            this.lotes.push(this.criarLote(lote));
          });
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

  public carregarLotes(): void {
    this.loteService
      .getLotesByEventoId(this.eventoId)
      .subscribe(
        (lotesRetorno: Lote[]) => {
          lotesRetorno.forEach((lote) => {
            this.lotes.push(this.criarLote(lote));
          });
        },
        (error: any) => {
          this.toastr.error('erro ao carregar Lotes', 'Erro!');
          console.error(error);
        }
      )
      .add(() => {
        this.spinner.hide();
      });
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
      //pode ter 1 ou varios lotes e ambos devem ser validados
      lotes: this.fb.array([]),
    });
  }

  adicionarLote(): void {
    // (this.form.get('lotes') as FormArray).push(
    //   this.fb.group({
    //     id: [lote.id],
    //     nome: [lote.nome, Validators.required],
    //     quantidade: [lote.quantidade, Validators.required],
    //     preco: [lote.preco, Validators.required],
    //     dataInicio: [lote.dataInicio],
    //     dataFim: [lote.dataFim],
    //   })
    // );
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, [Validators.required, Validators.minLength(4)]],
      quantidade: [
        lote.quantidade,
        [Validators.required, Validators.max(120000)],
      ],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio, Validators.required],
      dataFim: [lote.dataFim, Validators.required],
    });
  }

  public mudarValorData(value: Date, indice: number, campo: string): void {
    this.lotes.value[indice][campo] = value;
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarEvento(): void {
    this.spinner.show();
    if (this.form.valid) {
      if (this.estadoSalvar === 'post') {
        this.evento = { ...this.form.value };
        this.eventoService.postEvento(this.evento).subscribe(
          (eventoRetorno: Evento) => {
            this.toastr.success('Evento salvo com sucesso.', 'Sucesso');
            //this.estadoSalvar = 'put';
            // this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
            this.router.navigate([`eventos/lista`]);
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

  public salvarLotes(): void {
    if (this.form.controls.lotes.valid) {
      this.spinner.show();
      this.loteService
        .saveLote(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success('Lote salvo com sucesso', 'sucesso!');
            this.router.navigate([`eventos/detalhe/${this.eventoId}`]);
            //this.lotes.reset();
          },
          (error: any) => {
            this.toastr.error('Error ao tentar salvar lotes', 'Error!');
            console.error(error);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  public removerLote(
    event: any,
    template: TemplateRef<any>,
    indice: number
  ): void {
    this.loteAtual.id = this.lotes.get(indice + '.id')?.value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome')?.value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });

    // this.lotes.removeAt(indice);
  }

  // openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
  //   event.stopPropagation();
  //   this.eventoId = eventoId;
  //   this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  // }

  //refatorando pra usar o .add( () => this.spinner.hide());
  confirmDeleteLote(): void {
    this.modalRef?.hide();
    this.spinner.show();

    this.loteService
      .deleteLote(this.eventoId, this.loteAtual.id)
      .subscribe(
        (result: string) => {
          this.toastr.success(' Lote foi deletado com sucesso!', 'Deletado!');
          this.lotes.removeAt(this.loteAtual.indice);
          //this.spinner.hide();
          //this.carregarEventos();
        },
        (error: any) => {
          console.error(error);
          this.toastr.error(
            `Erro ao tentar apagar o lote ${this.loteAtual.nome}`,
            'Erro'
          );
        }
        //() => {
        //  this.spinner.hide();
        //}
      )
      .add(() => this.spinner.hide()); //o uso do add adicionar o show toda avez que ele sai do error, sucess
    this.toastr.success(' Lote foi deletado com sucesso!', 'Deletado!');
  }

  declineDeleleLote(): void {
    this.modalRef?.hide();
  }
}
