import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormViewService } from 'src/app/components/form-view/form-view.service';
import { FieldsColumnsConfig, FieldsValidatorsConfig } from 'src/app/models';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
})
export class PatientFormComponent implements OnInit {
  form!: FormGroup;
  values: any;
  values$: Subscription = new Subscription();

  constructor(private formView: FormViewService) {}

  ngOnInit(): void {
    this.values$ = this.formView.formValues.subscribe((formResponse) => {
      this.values = { ...this.values, ...formResponse };
    });
  }

  get patientAdditionalColumns(): FieldsColumnsConfig {
    return {
      phone: {
        col: 11,
      },
      games: {
        col: 1,
      },
      checkin: {
        col: 10,
      },
      season: {
        col: 2,
      },
      fruits: {
        col: 12,
      },
    };
  }

  get patientPersonalColumns(): FieldsColumnsConfig {
    return {
      name: {
        col: 6,
      },
      lastname: {
        col: 6,
      },
      email: {
        col: 6,
      },
    };
  }

  get patientPersonalValidators(): FieldsValidatorsConfig {
    return {
      email: [Validators.email, Validators.maxLength(20)],
    };
  }

  get patientAdditionalValidators(): FieldsValidatorsConfig {
    return {
      phone: [Validators.nullValidator, Validators.min(3)],
    };
  }

  get patientPersonalFields(): string[] {
    return ['name', 'lastname', 'email'];
  }

  get patientAdditionalFields(): string[] {
    return ['phone', 'games', 'checkin', 'season', 'fruits'];
  }

  hasFields(fields: {}): boolean {
    return !!Object.keys(fields).length;
  }

  filterObject(fields: any = {}, models: any = {}) {
    if (!models.length) {
      throw new Error('Please provide an array of model');
    }

    if (!Object.keys(fields).length) {
      return {};
    }

    const object: any = {};

    models.forEach((model: any) => {
      if (fields[model]) {
        object[model] = fields[model];
      }
    });

    return object;
  }

  handleFormValues(event: any) {
    this.values = { ...this.values, ...event };
  }

  handle(e: any) {
    // {
    //   event: $event,
    //   form: this.form,
    //   handleInput: this.handleInput,
    //   handleForm: this.handleForm
    // }
    console.log(e);
    e.formStore.onFormChanges(e.event);
    // debugger;
    // e.handleInput.emit(e.event);
    // e.handleForm.emit(e.form.value);
    // this.formView.onFormChanges(e.event);
    // console.log('formvalues', this.formView.formValues);
  }
}
