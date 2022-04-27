import { Component, OnInit } from '@angular/core';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  form: FormGroup | any;
  userUpdate = {} as UserUpdate;

  get f(): any {
    return this.form.controls;
  }
  constructor(
    private fb: FormBuilder,
    public accoutService: AccountService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
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
