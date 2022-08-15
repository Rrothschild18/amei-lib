import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent implements OnInit {
  @Input() field!: Field;
  @Input() form!: FormGroup;
  @Output() inputValue: EventEmitter<any> = new EventEmitter();

  get isValid() {
    return this.form.controls[this.field.name].valid;
  }

  constructor() {}

  ngOnInit(): void {
    // this.watchFormResponses();
  }

  handleInput({ fieldName, event }: any): void {
    this.inputValue.emit({
      fieldName,
      value: this.form.value[fieldName] || event,
    });
  }

  watchFormResponses(): void {
    this.form.valueChanges.subscribe((formValue: any) => {
      this.inputValue.emit({
        formValue,
      });
    });
  }

  showError(error: any) {
    if (error.required) return 'Este campo é obrigatório';
    if (error.email) return 'E-mail inválido';
    if (error.max) return `Número máximo de caracteres é ${error.max.max}`;
    if (error.maxlength)
      return `Número máximo de caracteres é ${error.maxlength.requiredLength}, atual ${error.maxlength.actualLength}`;

    return '';
  }
}
