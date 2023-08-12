import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  share,
  skip,
  takeWhile,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  Field,
  FieldColumnConfigTypes,
  FieldsAttributesConfig,
  FieldsColumnsConfig,
  FieldsConfig,
  FieldsValidatorsConfig,
  FormFieldContext,
} from 'src/app/models';
import { FormViewService } from '../form-view/form-view.service';
import { NgTemplateNameDirective } from 'src/app/directives/ng-template-name.directive';

export type FormViewModel = {
  fields: FieldsConfig<{}>;
  columns: FieldsColumnsConfig;
  validators: FieldsValidatorsConfig;
  attributes: FieldsAttributesConfig;
  values: any;
};

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() set fieldsAttributes(value: FieldsAttributesConfig | null) {
    const hasAttributes = !!Object.keys(value || {}).length;

    if (hasAttributes) {
      this._attributes$.next({ ...value });
      return;
    }

    if (!hasAttributes) {
      this._attributes$.next({});
      return;
    }
  }

  @Input() set fieldsValidators(value: FieldsValidatorsConfig | null) {
    const hasValidations = !!Object.keys(value || {}).length;

    if (hasValidations) {
      this._validators$.next({ ...value });
      return;
    }

    if (!hasValidations) {
      this._validators$.next({});
      return;
    }
  }

  @Input() set fields(value: FieldsConfig) {
    const hasFields = !!Object.keys(value || {}).length;

    if (hasFields) {
      this._fields$.next({ ...value });
      return;
    }

    if (!hasFields) {
      this._fields$.next({});
      return;
    }
  }

  @Input() set columns(value: FieldsColumnsConfig | null) {
    const hasColumns = !!Object.keys(value || {}).length;

    if (hasColumns) {
      this._columns$.next({ ...value });
      return;
    }

    if (!hasColumns) {
      this._columns$.next({});
      return;
    }
  }

  @Input() set values(value: any) {
    const hasValues = !!Object.keys(value || {}).length;

    if (hasValues) {
      this._values$.next({ ...value });
      return;
    }

    if (!hasValues) {
      this._values$.next({});
      return;
    }
  }

  private _fields$ = new BehaviorSubject<FieldsConfig>({} as FieldsConfig);
  private _values$ = new BehaviorSubject<any>({});
  private _attributes$ = new BehaviorSubject<FieldsAttributesConfig>({});
  private _validators$ = new BehaviorSubject<FieldsValidatorsConfig>({});
  private _columns$ = new BehaviorSubject<FieldsColumnsConfig>({});

  readonly fields$ = this._fields$
    .asObservable()
    .pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );

  readonly columns$ = this._columns$
    .asObservable()
    .pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );

  readonly attributes$ = this._attributes$
    .asObservable()
    .pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );

  readonly validators$ = this._validators$
    .asObservable()
    .pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );

  readonly values$ = this._values$
    .asObservable()
    .pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );

  vm$!: Observable<FormViewModel>;

  form: FormGroup = this.fb.group({});

  private subSinks: Subscription = new Subscription();

  @ContentChildren(NgTemplateNameDirective)
  _templates!: QueryList<NgTemplateNameDirective>;

  constructor(private fb: FormBuilder, private formService: FormViewService) {}

  ngOnInit(): void {
    this.vm$ = combineLatest({
      fields: this.fields$.pipe(tap(() => this.setUpForm())),
      columns: this.columns$, //TODO create an pipe
      attributes: this.attributes$.pipe(tap(() => this.setUpFormAttributes())),
      validators: this.validators$.pipe(tap(() => this.setUpFormValidators())),
      values: this.values$.pipe(tap(() => this.setUpFormValues())),
    });

    this.setUpFormChange();

    this.formService.formValues
      .pipe(
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe((values) => {
        this._values$.next(values);
      });
  }

  ngOnDestroy() {
    this.subSinks.unsubscribe();
  }

  get hasFormValues(): boolean {
    return !!Object.values(this.form.value).length;
  }

  setUpForm() {
    const [keysToAdd, keysToDelete] =
      this.calculateDiffBetweenControlsAndFields();

    this.deleteKeysFromFormControl(keysToDelete);

    const mappedFields = Object.entries(this._fields$.getValue());
    const fieldsType = [
      'text',
      'select',
      'textarea',
      'date',
      'radio',
      'email',
      'autocomplete',
      'checkbox',
    ];

    for (let [fieldName, field] of mappedFields) {
      if (!keysToAdd.includes(fieldName)) continue;

      const fieldType = field?.type ?? 'text';

      if (fieldsType.includes(fieldType)) {
        this.form.addControl(fieldName, new FormControl(''));
      }

      if (fieldType === 'checkboxGroup') {
        const checkBoxGroupConfig = this.setUpCheckboxControl(fieldName, field);

        this.form.addControl(fieldName, this.fb.group(checkBoxGroupConfig));
      }
    }
  }

  //TODO => Need to setUp validators required as default whenever fields changes or not
  setUpFormValidators() {
    const validations = this._validators$.getValue();
    const mappedFields = Object.entries(this._fields$.getValue());

    mappedFields.forEach(([fieldName, field]: any) => {
      const existValidation = validations[fieldName];

      // debugger;
      if (existValidation) {
        this.form.get(fieldName)?.clearValidators();
        this.form.get(fieldName)?.updateValueAndValidity();

        const validators = validations[fieldName] || [Validators.required];

        this.form.get(fieldName)?.addValidators(validators);
        this.form.get(fieldName)?.updateValueAndValidity();

        return;
      }
      // debugger;

      this.form.get(fieldName)?.addValidators([Validators.required]);
      this.form.get(fieldName)?.updateValueAndValidity();
    });
  }

  setUpFormAttributes() {
    const mappedAttributes = Object.entries(this._attributes$.getValue());
    mappedAttributes.forEach(([fieldName, attributes]: any) => {
      const fieldNoExists = !this._fields$.getValue()[fieldName];

      if (fieldNoExists) return;

      const isFormControlDisabled =
        this.form.get(fieldName)?.status === 'DISABLED';

      if (isFormControlDisabled && attributes.disabled) return;

      if (isFormControlDisabled && !attributes.disabled) {
        this.form.get(fieldName)?.enable();
        return;
      }

      if (!isFormControlDisabled && attributes.disabled) {
        this.form.get(fieldName)?.disable();
        return;
      }

      attributes.disabled && this.form.get(fieldName)?.disable();
    });

    return;
  }

  setUpFormValues() {
    /**
     * This method has the purpose to merge incoming values fetched from api
     * with current form value keys.
     * I need to figure out some way better to diff those objects and correctly merge data
     */

    const currentFormKeys = Object.keys(this.form.value);
    const currentValuesKeys = Object.keys(this._values$.getValue());

    debugger;

    let newFormValue = currentFormKeys.reduce((acc: any, curr: string) => {
      const v =
        this._values$.getValue()[curr] !== this.form.value[curr] &&
        this.form.value[curr] !== '' &&
        this.form.value[curr] !== undefined;
      // debugger;

      // console.log('patched Value');

      return {
        ...acc,
        [curr]: v ? this.form.value[curr] : this._values$.getValue()[curr],
      };
    }, {});

    newFormValue = { ...newFormValue };

    // debugger;
    this.form.patchValue(
      { ...newFormValue }
      // {
      //   emitEvent: false,
      // }
    );
  }

  setUpCheckboxControl(fieldName: string, field: any) {
    const checkBoxGroup = field.options.reduce(
      (acc: {}, option: { label: string; value: string }) => {
        return {
          ...acc,
          [option.label]: [
            {
              value: false,
            },
          ],
        };
      },
      {}
    );

    return checkBoxGroup;
  }

  setUpFormChange(): void {
    const formValueSubscription = this.form.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((changedValue) => {
        this.formService.onFormChanges2({
          ...changedValue,
        });
      });

    this.subSinks.add(formValueSubscription);
  }

  calculateDiffBetweenControlsAndFields(): [string[], string[]] {
    const currentControlsKeys = Object.keys(this.form.controls);
    const incomingFieldsKeys = Object.keys(this._fields$.getValue());

    const deletedKeysFromControls = currentControlsKeys.filter(
      (key) => !incomingFieldsKeys.includes(key)
    );
    const addedKeysFromIncomingFields = incomingFieldsKeys.filter(
      (key) => !currentControlsKeys.includes(key)
    );

    const hasDeleted = !!deletedKeysFromControls.length;
    const hasAdded = !!addedKeysFromIncomingFields.length;

    if (!hasDeleted && !hasAdded) return [[], []];

    return [addedKeysFromIncomingFields, deletedKeysFromControls];
  }

  getTemplateRefByName(name: string): TemplateRef<any> | null {
    const dir = this._templates.find((dir) => dir.name === name);

    return dir ? dir.template : null;
  }

  fieldContext(field: Field): FormFieldContext {
    return {
      field,
      formGroupRef: this.form as FormGroup,
      formControlRef: this.form.get(field.name) as FormControl,
    };
  }

  deleteKeysFromFormControl(keys: string[]) {
    keys.forEach((key) => this.form.removeControl(key));
  }

  getFieldClass(field: Field) {
    if (typeof this._columns$.getValue() === 'string') {
      return `col-${this._columns$.getValue()}`;
    }

    return Array.isArray(this._columns$.getValue())
      ? this.handleColumnsByIndex(field.name)
      : this.handleColumnsByField(field.name);
  }

  handleColumnsByField(index: any) {
    return this.breakpoint(this._columns$.getValue()[index]);
  }

  handleColumnsByIndex(index: any) {
    if (!Array.isArray(this.fields)) {
      index = Object.keys(this.fields).findIndex((field) => field === index);
    }

    const length = Object.values(this._columns$.getValue()).length;

    if (!length) {
      return this.setDefaultColumnClass();
    }

    return this.breakpoint(this._columns$.getValue()[index]);
  }

  setDefaultColumnClass() {
    return 'col-6';
  }

  breakpoint(columns: FieldColumnConfigTypes = {}) {
    const classes = [];
    const profiles: any = {
      col: 'col',
      xs: 'col-xs',
      sm: 'col-sm',
      md: 'col-md',
      lg: 'col-lg',
      xl: 'col-xl',
    };

    for (const key in columns) {
      const value = columns[key];
      classes.push(`${profiles[key]}-${value}`);
    }

    return [...classes];
  }

  getFieldAttributes(fieldName: string) {
    return this._attributes$.getValue()[fieldName];
  }

  //KeyValue sort by key, bypass
  unsorted(a: any, b: any): number {
    return 0;
  }

  //Todo validate all on submit
  validateAllFormFields(formGroup?: FormGroup) {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        // this.validateAllFormFields(control);
      }
    });
  }

  trackByFn(index: number, item: any): number {
    return item.key;
  }
}
