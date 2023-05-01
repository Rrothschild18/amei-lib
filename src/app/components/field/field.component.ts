import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { FormViewService } from 'src/app/components/form-view/form-view.service';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Field, FieldAttrs } from 'src/app/models/field';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { FieldConfig } from 'src/app/models';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class FieldComponent implements OnInit, OnDestroy {
  @Input() field!: FieldConfig<{}, keyof {}> | Field;
  @Input() form!: FormGroup;
  @Input() fieldFormControl!: AbstractControl | null;
  //ngx-mask not included
  @Input() fieldAttributes: FieldAttrs | undefined;

  private subSinks: Subscription = new Subscription();

  get isValid() {
    return this.form.controls[this.field.name].valid;
  }

  constructor(private formService: FormViewService) {}

  ngOnInit(): void {
    this.setUpFieldChange();
  }

  ngOnDestroy() {
    this.subSinks.unsubscribe();
  }

  ngAfterViewInit() {}

  setUpFieldChange(): void {
    const fieldValueSubscription = this.fieldFormControl?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((changedValue) => {
        this.formService.formValues.next({
          fieldName: this.field.name,
          value: changedValue,
        });
      });

    this.subSinks.add(fieldValueSubscription);
  }

  //TODO map errors with an object, destruct arguments and accept custom errors messages
  showError(error: any) {
    debugger;
    console.log(error);
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
