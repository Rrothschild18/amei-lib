import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { Field, FieldAttrs } from 'src/app/models/field';
import { FieldConfig } from 'src/app/models';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class FieldComponent implements OnInit, AfterViewInit {
  @Input() field!: FieldConfig<{}> | Field;
  @Input() fieldAttributes: FieldAttrs | undefined;

  constructor(
    private controlContainer: ControlContainer,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.controlContainer.valueChanges?.subscribe((v) => {
      // this.cdRef.detectChanges();
      // debugger;
    });
  }

  get fieldRef() {
    return this.controlContainer.control?.get(this.field.name);
  }

  //TODO create an pipe for errors, or use filter Object
  showError(error: any) {
    if (error.required) return 'Este campo é obrigatório';
    if (error.email) return 'E-mail inválido';
    if (error.max) return `Número máximo de caracteres é ${error.max.max}`;
    if (error.maxlength)
      return `Número máximo de caracteres é ${error.maxlength.requiredLength}, atual ${error.maxlength.actualLength}`;
    if (error.min)
      return `Número minimo de caracteres é ${error.min.min}, atual ${error.min.actual}`;

    if (error.matDatepickerMin)
      return `A data precisa ser superior a ${new Date(
        error.matDatepickerMin.min
      ).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })}`;

    return 'default error xD';
  }
}
