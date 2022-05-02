import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounce, debounceTime, map, tap } from 'rxjs';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss'],
})
export class PalestranteDetalheComponent implements OnInit {
  form!: FormGroup;
  situacaoDoForm = '';
  corDaDescricao = '';

  constructor(
    private fb: FormBuilder,
    public palestranteService: PalestranteService,
    public toaster: ToastrService,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.validation();
    this.verificaForm();
    this.carregarPalestrante();
  }

  private validation(): void {
    this.form = this.fb.group({
      miniCurriculo: [''],
    });
  }

  private verificaForm(): void {
    this.form.valueChanges
      .pipe(
        map(() => {
          (this.situacaoDoForm = 'Mini curriculo esta sendo atualizado '),
            (this.corDaDescricao = 'text-warning');
        }),

        debounceTime(1000),
        tap(() => this.spinner.show())
      )
      .subscribe(
        () => {
          this.palestranteService
            .put({ ...this.form.value })
            .subscribe(
              () => {
                (this.situacaoDoForm = 'Mini curriculo foi atulizado'),
                  (this.corDaDescricao = 'text-success');

                setTimeout(() => {
                  (this.situacaoDoForm = 'Mini curriculo foi carregado'),
                    (this.corDaDescricao = 'text-muted');
                }, 2000);
              },

              (error: any) => {
                this.toaster.error(
                  'erro ao tentar atulizar palestrante ',
                  'Error!'
                );
              }
            )
            .add(() => this.spinner.hide());
        },

        () => {}
      );
  }

  private carregarPalestrante(): void {
    this.spinner.show();

    this.palestranteService
      .getPalestrante()
      .subscribe(
        (palestrante: Palestrante) => {
          this.form.patchValue(palestrante);
        },
        (error: any) => {
          this.toaster.error('Erro ao carregar o palestrante', 'Error!');
        }
      )
      .add(() => this.spinner.hide());
  }

  public get f(): any {
    return this.form.controls;
  }
}
