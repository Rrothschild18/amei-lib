import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormViewService } from 'src/app/components/form-view/form-view.service';
import {
  FieldsArrayName,
  FieldsColumnsConfig,
  FieldsValidatorsConfig,
} from 'src/app/models';
import { Patient } from 'src/app/interfaces';

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

  get patientPersonalColumns(): FieldsColumnsConfig<Patient> {
    return {
      name: {
        col: 6,
      },
      lastName: {
        col: 6,
      },
      email: {
        col: 6,
      },
    };
  }

  get patientPersonalValidators(): FieldsValidatorsConfig<Patient> {
    return {
      email: [Validators.email, Validators.maxLength(20)],
    };
  }

  get patientPersonalFields(): FieldsArrayName<Patient> {
    return ['name', 'lastName', 'email'];
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

  //Type this event
  handle(e: any) {
    e.formStore.onFormChanges({
      fieldName: 'name',
      value: e.form.get('name').value,
    });
  }
}
