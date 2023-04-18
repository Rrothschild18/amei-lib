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
  Subscription,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  startWith,
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

  autoCompleteOptions$ = new BehaviorSubject<
    { label: string; value: string | number }[]
  >([]);

  //

  filteredAutoCompleteOptions$ = combineLatest({
    options: this.autoCompleteOptions$,
    value: this.fieldFormControl?.valueChanges.pipe(startWith('')) || of(''),
  }).pipe(
    map(({ options, value }) => {
      debugger;
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(value.toLowerCase())
      );
      debugger;
      return filteredOptions;
    })
  );

  private fieldValueSubscription$?: Subscription = new Subscription();

  get isValid() {
    return this.form.controls[this.field.name].valid;
  }

  constructor(private formService: FormViewService) {}

  ngOnInit(): void {
    if (this.field.type === 'autocomplete') {
      this.autoCompleteOptions$.next(this.field.options || []);
    }

    this.setUpFieldChange();
  }

  ngOnDestroy() {
    this.fieldValueSubscription$?.unsubscribe();
  }

  setUpFieldChange(): void {
    this.fieldValueSubscription$ = this.fieldFormControl?.valueChanges
      .pipe(
        distinctUntilChanged(),
        map((changedValue) => {
          if (this.field.type === 'autocomplete') {
            return this.handleAutoCompleteValueChange(changedValue);
          }

          // console.log({ fieldFormControl: this.fieldFormControl });
          return changedValue;
        })
      )
      .subscribe((changedValue) => {
        debugger;
        if (this.field.type === 'autocomplete') {
          debugger;
          this.formService.formValues.next({
            fieldName: this.field.name,
            value: changedValue.value,
          });

          return;
        }

        this.formService.formValues.next({
          fieldName: this.field.name,
          value: changedValue.value || changedValue,
        });
      });
  }

  //TODO map errors with an object, destruct arguments and accept custom errors messages
  showError(error: any) {
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

  displayFn(value: { label: string; value: string | number }): string {
    if (this.field.options) {
      const selectedOption = this.field.options.find(
        (option) => option.value === value.value
      );

      return selectedOption?.label || '';
    }

    return '';
  }

  handleAutoCompleteValueChange(
    autoCompleteEmittedValue: string | number | { label: string; value: string }
  ) {
    debugger;
    const isObject = typeof autoCompleteEmittedValue === 'object';
    const isTruthy =
      autoCompleteEmittedValue !== null ||
      autoCompleteEmittedValue !== undefined;
    const hasLabel =
      isObject && isTruthy && 'label' in autoCompleteEmittedValue;
    const hasValue =
      isObject && isTruthy && 'value' in autoCompleteEmittedValue;

    if (isObject && isTruthy && hasLabel && hasValue) {
      return autoCompleteEmittedValue;
    }
    debugger;

    return autoCompleteEmittedValue;
  }
}
