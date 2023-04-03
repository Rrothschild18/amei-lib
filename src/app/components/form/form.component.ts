import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, tap } from 'rxjs';
import {
  FieldsAttributesConfig,
  FieldsColumnsConfig,
  FieldsConfig,
  FieldsValidatorsConfig,
} from 'src/app/models';

export type FormViewModel = {
  fields: FieldsConfig<{}>;
  columns: FieldsColumnsConfig;
  fieldsValidators: FieldsValidatorsConfig;
  fieldsAttributes: FieldsAttributesConfig;
};

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit {
  @Input() set fieldsAttributes(value: FieldsAttributesConfig | null) {
    const hasAttributes = !!Object.keys(value || {}).length;

    if (hasAttributes) {
      this._fieldsAttributes$.next({ ...value });
      return;
    }

    if (!hasAttributes) {
      this._fieldsAttributes$.next({});
      return;
    }
  }

  @Input() set fieldsValidators(value: FieldsValidatorsConfig | null) {
    const hasValidations = !!Object.keys(value || {}).length;

    if (hasValidations) {
      this._fieldsValidators$.next({ ...value });
      return;
    }

    if (!hasValidations) {
      this._fieldsValidators$.next({});
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

  @Input() set columns(value: FieldsColumnsConfig) {
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

  private _fieldsAttributes$ = new BehaviorSubject<FieldsAttributesConfig>({});
  private _fieldsValidators$ = new BehaviorSubject<FieldsValidatorsConfig>({});
  private _fields$ = new BehaviorSubject<FieldsConfig>({} as FieldsConfig);
  private _columns$ = new BehaviorSubject<FieldsColumnsConfig>({});

  readonly fields$ = this._fields$.asObservable();
  readonly columns$ = this._columns$.asObservable();
  readonly fieldsAttributes$ = this._fieldsAttributes$.asObservable();
  readonly fieldsValidators$ = this._fieldsValidators$.asObservable();

  vm$!: Observable<FormViewModel>;

  form: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.vm$ = combineLatest({
      fields: this.fields$,
      columns: this.columns$,
      fieldsAttributes: this.fieldsAttributes$,
      fieldsValidators: this.fieldsValidators$,
    }).pipe(
      tap(() => this.setUpFormGroups()),
      tap(() => this.setUpFormGroupsValidators()),
      tap(() => this.setUpFormAttributes())
    );

    // this.setUpFormGroups();
  }

  get hasFormValues(): boolean {
    return !!Object.values(this.form.value).length;
  }

  setUpFormGroups() {
    const [keysToAdd, keysToDelete] =
      this.calculateDiffBetweenControlsAndFields();

    //TODO Delete values keys from stores
    this.deleteKeysFromFormControl(keysToDelete);

    const mappedFields = Object.entries(this._fields$.getValue());
    const fieldsType = ['text', 'select', 'textarea', 'date', 'radio', 'email'];

    for (let [fieldName, field] of mappedFields) {
      if (!keysToAdd.includes(fieldName)) continue;

      const fieldType = field?.type ?? 'text';

      if (fieldsType.includes(fieldType)) {
        this.form.addControl(fieldName, new FormControl(''));
      }

      if (fieldType === 'checkbox') {
        const checkBoxGroupConfig = this.setUpCheckboxControl(fieldName, field);

        this.form.addControl(fieldName, this.fb.group(checkBoxGroupConfig));
      }
    }
  }

  setUpFormGroupsValidators() {
    const validations = this._fieldsValidators$.getValue();
    const mappedFields = Object.entries(this._fields$.getValue());

    mappedFields.forEach(([fieldName, field]: any) => {
      const existValidation = validations[fieldName];

      if (existValidation) {
        this.form.get(fieldName)?.clearValidators();

        const validators = validations[fieldName] || [Validators.required];

        this.form.get(fieldName)?.addValidators(validators);
        this.form.get(fieldName)?.updateValueAndValidity();

        return;
      }

      this.form.get(fieldName)?.addValidators([Validators.required]);
    });
  }

  setUpFormAttributes() {
    return;
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

  deleteKeysFromFormControl(keys: string[]) {
    keys.forEach((key) => this.form.removeControl(key));
  }

  ngAfterViewInit() {
    debugger;
  }
}
