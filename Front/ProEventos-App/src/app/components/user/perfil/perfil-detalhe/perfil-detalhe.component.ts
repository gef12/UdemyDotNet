import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identify/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss'],
})
export class PerfilDetalheComponent implements OnInit {
  @Output() changeFormValue = new EventEmitter();
  form: FormGroup | any;
  userUpdate = {} as UserUpdate;

  get f(): any {
    return this.form.controls;
  }
  constructor(
    private fb: FormBuilder,
    public accoutService: AccountService,
    public palestranteService: PalestranteService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
    this.verificaForm();
  }

  private verificaForm(): void {
    this.form.valueChanges.subscribe(() =>
      this.changeFormValue.emit({ ...this.form.value })
    );
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.accoutService
      .getUser()
      .subscribe(
        (userRetorno: UserUpdate) => {
          this.userUpdate = userRetorno;
          this.form.patchValue(this.userUpdate);
          this.toaster.success('Usuario foi carregado com sucesso', 'Sucesso!');
        },
        (error: any) => {
          console.error(error);
          this.toaster.error('Usuario não carregado', 'Error!');
          this.router.navigate(['/dashboard']);
        }
      )
      .add(() => this.spinner.hide());
  }

  public validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmPassword'),
    };
    this.form = this.fb.group(
      {
        userName: [''],
        imagemURL: [''],
        titulo: ['NaoInformado', Validators.required],
        primeiroNome: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
          ],
        ],
        ultimoNome: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [
            Validators.required,
            //Validators.minLength(10),
            //Validators.maxLength(11),
          ],
        ],
        funcao: ['NaoInformado', [Validators.required]],
        descricao: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(200),
          ],
        ],
        password: [
          '',
          [
            //Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
            Validators.nullValidator,
          ],
        ],
        confirmPassword: ['', Validators.nullValidator],
      },
      formOptions
    );
  }

  onSubmit(): void {
    this.atualizarUsuario();
  }

  public atualizarUsuario() {
    this.userUpdate = { ...this.form.value };
    this.spinner.show();

    if (this.f.funcao.value == 'Palestrante') {
      //chamando a função de ciar o regristro na tabela de palestrante

      this.palestranteService.post().subscribe(
        () => {
          this.toaster.success('Função Palestrante Ativada', 'Success!');
        },
        (error: any) => {
          this.toaster.error(
            'A função paletrante não pode ser ativada',
            'error!'
          );
          console.error(error);
        }
      );
    }

    this.accoutService
      .updateUser(this.userUpdate)
      .subscribe(
        () => {
          this.toaster.success('Usuario atulizado', 'Sucesso');
        },
        (error: any) => {
          console.error(error);
          this.toaster.error('erro ao atualiza usuario v3', 'Error');
        }
      )
      .add(() => this.spinner.hide());
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }
}
