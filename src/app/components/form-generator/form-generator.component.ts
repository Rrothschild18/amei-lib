import {
  Component,
  OnInit,
  Input,
  ContentChildren,
  QueryList,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  ValidatorFn,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NgTemplateNameDirective } from 'src/app/directives/ng-template-name.directive';
import {
  FieldColumnConfigTypes,
  FieldsColumnsConfig,
  FieldsConfig,
  FieldsValidatorsConfig,
  FormFieldContext,
} from 'src/app/models';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormGeneratorComponent implements OnInit {
  fields!: FieldsConfig;
  form: FormGroup = new FormGroup({});

  @Input('fields') set onFieldsChange(fields: FieldsConfig) {
    this.fields = fields;
    this.toFormGroup(this.toArrayFields(this.fields));
  }

  @Input('fieldsValidators') fieldsValidators: FieldsValidatorsConfig = {};

  @Input('columns') columns: FieldsColumnsConfig = {};

  @ContentChildren(NgTemplateNameDirective)
  _templates!: QueryList<NgTemplateNameDirective>;

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {}

  get hasFields(): boolean {
    return !!Object.keys(this.fields).length;
  }

  get hasFormValues(): boolean {
    return !!Object.values(this.form.value).length;
  }

  fieldContext(field: Field): FormFieldContext {
    return {
      field,
      formGroupRef: this.form as FormGroup,
      formControlRef: this.form.get(field.name) as FormControl,
    };
  }

  toFormGroup(fields: Field[] = []) {
    console.log('Render FieldControls');
    const fieldsType = ['text', 'select', 'textarea', 'date', 'radio'];
    const form: any = {};
    const formPivot: FormGroup = this.form;

    for (let field of fields) {
      if (field.type === 'checkbox') {
        let checkBoxGroup: any = {};

        field.options.forEach((option: { label: string; value: string }) => {
          checkBoxGroup[option.label] = ['', this.handleValidators(field.name)];
        });

        form[field.name] = this.fb.group(checkBoxGroup);
      }

      if (fieldsType.includes(field.type)) {
        for (let { name: fieldName } of fields) {
          form[fieldName] = ['', this.handleValidators(fieldName)];
        }
      }
    }

    this.form = this.fb.group(form);
    this.form.patchValue(formPivot.value);
  }

  toArrayFields(fields: {} = {}): Field[] {
    return Object.values(fields);
  }

  //Todo validate all on submit
  validateAllFormFields(formGroup: FormGroup) {
    //{1}
    Object.keys(formGroup.controls).forEach((field) => {
      //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof FormControl) {
        //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      }
    });
  }

  getTemplateRefByName(name: string): TemplateRef<any> | null {
    const dir = this._templates.find((dir) => dir.name === name);

    return dir ? dir.template : null;
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

  getFieldClass(index: any) {
    if (typeof this.columns === 'string') {
      return `col-${this.columns}`;
    }

    return Array.isArray(this.columns)
      ? this.handleColumnsByIndex(index)
      : this.handleColumnsByField(index);
  }

  handleColumnsByField(index: any) {
    return this.breakpoint(this.columns[index]);
  }

  handleColumnsByIndex(index: any) {
    if (!Array.isArray(this.fields)) {
      index = Object.keys(this.fields).findIndex((field) => field === index);
    }

    const length = Object.values(this.columns).length;

    if (!length) {
      return this.setDefaultColumnClass();
    }

    return this.breakpoint(this.columns[index]);
  }

  handleValidators(fieldName: string): ValidatorFn[] {
    const validators: ValidatorFn[] = this.fieldsValidators[fieldName] || [];
    const hasNullByPass: boolean = validators.some(
      (validator) => validator === Validators.nullValidator
    );

    return hasNullByPass ? validators : [Validators.required, ...validators];
  }

  setDefaultColumnClass() {
    return 'col-6';
  }
}
