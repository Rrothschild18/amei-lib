import { FormGroup, FormControl } from '@angular/forms';

export class Field {
  name: string;
  label: string;
  type: FieldTypes;
  placeholder?: string;
  options: { label: string; value: string }[];
  children: {
    [key: string]: Field;
  };

  constructor(
    options: {
      label?: string;
      name?: string;
      key?: string;
      type?: FieldTypes;
      options?: { label: string; value: string }[];
      children?: { [key: string]: Field };
    } = {}
  ) {
    this.label = options.label || '';
    this.name = options.name || '';
    this.type = options.type || 'text';
    this.children = {};
    this.options = options.options || [];
  }
}

export interface FormFieldContext {
  field: Field;
  formGroupRef: FormGroup;
  formControlRef: FormControl | null;
}

type FieldTypes =
  | 'text'
  | 'select'
  | 'textarea'
  | 'date'
  | 'radio'
  | 'email'
  | 'checkbox';
