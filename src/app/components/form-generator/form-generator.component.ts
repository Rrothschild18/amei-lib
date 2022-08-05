import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ContentChildren,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgTemplateNameDirective } from 'src/app/directives/ng-template-name.directive';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss'],
})
export class FormGeneratorComponent implements OnInit, OnChanges {
  @Input('fields') fields!: Field[];
  @Input('columns') columns!: any;
  form!: FormGroup;
  @Output() input: EventEmitter<any> = new EventEmitter();
  @Output() formValues: EventEmitter<any> = new EventEmitter();
  @ContentChildren(NgTemplateNameDirective)
  _templates!: QueryList<NgTemplateNameDirective>;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    //Remake this, probably a state problem
    if (this.toArrayFields(changes['fields'].currentValue)) {
      this.toFormGroup(this.toArrayFields(changes['fields'].currentValue));
    }
  }

  toFormGroup(fields: Field[] = []) {
    const group: any = {};

    for (let field of fields) {
      if (field.type === 'checkbox') {
        let checkBoxGroup: any = {};

        field.options.forEach((option: any) => {
          checkBoxGroup[option.label] = field.required
            ? new FormControl(false, Validators.required)
            : new FormControl(false);
        });

        group[field.name] = new FormGroup(checkBoxGroup);
      }

      if (['text', 'select', 'textarea'].includes(field.type)) {
        fields.forEach(
          (field) =>
            (group[field.name] = field.required
              ? new FormControl('', Validators.required)
              : new FormControl(''))
        );
      }
    }

    try {
      if (!!Object.values(this.form?.value).length) return;
    } catch (e) {
      console.log(e);
    }

    this.form = new FormGroup(group);
  }

  toArrayFields(fields: {} = {}): Field[] {
    return Object.values(fields);
  }

  handleInputs(event: any) {
    this.input.emit(event);
    this.formValues.emit(this.form.getRawValue());
  }

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

  breakpoint(columns: any) {
    const classes = [];
    const profiles: any = {
      col: 'col',
      xs: 'col-xs',
      sm: 'col-sm',
      md: 'col-md',
      lg: 'col-lg',
      xl: 'col-xl',
    };
    const { classes: renamedClasses, ...formattedColumns } = columns || {};

    for (const key in formattedColumns) {
      const value = formattedColumns[key];
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

    const length = this.columns.length;

    if (!length) {
      return this.setDefaultColumnClass();
    }

    return this.breakpoint(this.columns[index]);
  }

  setDefaultColumnClass() {
    return 'col-6';
  }
}
