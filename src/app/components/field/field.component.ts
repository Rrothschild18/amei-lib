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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent implements OnInit, OnDestroy {
  @Input() field!: Field;
  @Input() form!: FormGroup;
  @Input() fieldFormControl!: AbstractControl | null;
  //ngx-mask not included
  @Input() fieldAttributes: FieldAttrs | undefined;

  private fieldValueSubscription$?: Subscription = new Subscription();

  get isValid() {
    return this.form.controls[this.field.name].valid;
  }

  constructor(private formService: FormViewService) {}

  ngOnInit(): void {
    this.setUpFieldChange();
  }

  ngOnDestroy() {
    this.fieldValueSubscription$?.unsubscribe();
  }

  setUpFieldChange(): void {
    this.fieldValueSubscription$ =
      this.fieldFormControl?.valueChanges.subscribe((changedValue) => {
        debugger;
        this.formService.formValues.next({
          fieldName: this.field.name,
          value: changedValue,
        });
      });
    this.form.updateValueAndValidity();
  }

  //TODO map errors with an object, destruct arguments and accept custom errors messages
  showError(error: any) {
    if (error.required) return 'Este campo é obrigatório';
    if (error.email) return 'E-mail inválido';
    if (error.max) return `Número máximo de caracteres é ${error.max.max}`;
    if (error.maxlength)
      return `Número máximo de caracteres é ${error.maxlength.requiredLength}, atual ${error.maxlength.actualLength}`;
    if (error.min)
      return `Número minimo de caracteres é ${error.min.min}, atual ${error.min.actual}`;

    return 'default error xD';
  }
}
