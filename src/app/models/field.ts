import { ThemePalette } from '@angular/material/core';
import {
  FloatLabelType,
  MatFormFieldAppearance,
} from '@angular/material/form-field';

export class Field {
  name: string;
  label: string;
  type: FieldTypes;
  placeholder?: string;
  options: { label: string; value: string }[];
  loadingStatus: boolean;
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
    this.loadingStatus = false;
    this.children = {};
    this.options = options.options || [];
  }
}

export type FieldTypes =
  | 'text'
  | 'select'
  | 'textarea'
  | 'date'
  | 'radio'
  | 'email'
  | 'checkbox'
  | 'checkboxGroup'
  | 'autocomplete';

export interface IBasicInputAttributes {
  name?: string;
  value?: any;
  mask?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  minlength?: number;
  maxlength?: number;
  pattern?: string;
  multiple?: boolean;
  indeterminate?: boolean;
  min?: Date;
  max?: Date;
  hideRequiredMarker?: boolean;
}

export interface ITextareaAttributes extends IBasicInputAttributes {
  rows?: number;
  cols?: number;
}

export interface ISelectAttributes extends IBasicInputAttributes {
  multiple?: boolean;
}

export type FieldAttrs =
  | IBasicInputAttributes
  | ITextareaAttributes
  | ISelectAttributes
  | IMaterialInputAttributes;

export interface IMaterialInputAttributes extends IBasicInputAttributes {
  hideRequiredMarker?: boolean;
  floatLabel?: FloatLabelType;
  appearance?: MatFormFieldAppearance;
  color?: ThemePalette;
  hintLabel?: string;
}
