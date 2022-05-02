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
import { environment } from '@environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  usuario = {} as UserUpdate;

  public imagemURL = '';

  file: File | any;

  constructor(
    public accoutService: AccountService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  public get ehPalestrante(): boolean {
    return this.usuario.funcao === 'Palestrante';
  }

  public setFormValue(usuario: UserUpdate): void {
    this.usuario = usuario;

    if (this.usuario.imagemURL)
      this.imagemURL =
        environment.apiURL + `Resources/perfil/${this.usuario.imagemURL}`;
    else this.imagemURL = environment.apiURL + 'assets/img/perfil.png';
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => (this.imagemURL = event.target.result);

    this.file = ev.target.files;

    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  private uploadImagem(): void {
    this.spinner.show();
    this.accoutService
      .postUpload(this.file)
      .subscribe(
        () => {
          this.toaster.success('Imagem Atulizada com sucesso', 'Sucess!');
        },
        (error: any) => {
          console.log(error);
          this.toaster.error(
            'Upload de imagem de perfil não enviada ',
            'Error!'
          );
        }
      )
      .add(() => this.spinner.hide());
  }
}
