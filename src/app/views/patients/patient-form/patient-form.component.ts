import { FieldsConfig } from './../../../models/form';
import { Observable, tap } from 'rxjs';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  FormValue,
  FormViewService,
} from 'src/app/components/form-view/form-view.service';
import {
  FieldsArrayName,
  FieldsColumnsConfig,
  FieldsValidatorsConfig,
} from 'src/app/models';
import { Patient } from 'src/app/interfaces';
import { FormGeneratorComponent } from 'src/app/components/form-generator/form-generator.component';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
  providers: [{ provide: FormViewService }],
})
export class PatientFormComponent implements OnInit {
  form!: FormGroup;
  values: any = {};
  componentStore$: Observable<FormValue> = this.formService.formValues;

  @ViewChildren(FormGeneratorComponent)
  personalForm!: QueryList<FormGeneratorComponent>;

  constructor(public formService: FormViewService) {}

  ngOnInit(): void {
    this.componentStore$
      .pipe(
        tap((formValue) => {
          console.log('FormValue', { formValue });
        })
      )
      .subscribe(({ fieldName, value }: FormValue) => {
        if (!fieldName && !value) {
          return {};
        }

        return (this.values = { ...this.values, [fieldName]: value });
      });
  }

  ngAfterViewInit() {
    this.personalForm?.first?.form?.valueChanges.subscribe((value) => {
      console.log('formValues', { value });
    });
  }

  ngOnChanges() {}

  get patientPersonalColumns(): FieldsColumnsConfig<Patient> {
    return {
      name: {
        col: 12,
      },
      lastName: {
        md: 12,
        lg: 4,
      },
      email: {
        md: 3,
        lg: 4,
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

  get patientAdditionalColumns(): FieldsColumnsConfig<Patient> {
    return {
      address: {
        col: 12,
      },
      birthDate: {
        col: 12,
      },
    };
  }

  get patientAdditionalValidators(): FieldsValidatorsConfig<Patient> {
    return {
      address: [Validators.email, Validators.maxLength(20)],
    };
  }

  get patientAdditionalFields(): FieldsArrayName<Patient> {
    return ['address', 'birthDate'];
  }

  hasFields(fields: {}): boolean {
    return !!Object.keys(fields).length;
  }

  filterObject(
    fields: FieldsConfig<Patient>,
    models: FieldsArrayName<Patient>
  ): FieldsConfig<Patient> {
    if (!models.length) {
      throw new Error('Please provide an array of model');
    }

    if (!Object.keys(fields).length) {
      return {} as any;
    }

    const object: any = {};

    models.forEach((model: keyof Patient) => {
      if (fields[model]) {
        object[model] = fields[model];
      }
    });

    return object;
  }
  //Type this event
  handle(e: any) {
    e.formStore.onFormChanges({
      fieldName: 'name',
      value: e.form.get('name').value,
    });

    // e.form.valueChanges.subscribe((formValue: any) => {
    //   console.log('Form Value has changed at component', { formValue });
    // });
  }

  bondForm() {
    this.personalForm;

    this.componentStore$.subscribe((formResponse) => {
      this.values = { ...this.values, ...formResponse };
    });
    return;
  }

  handleClick(fieldRef: FormControl) {
    this.formService.formValues.asObservable().subscribe((v) => {
      console.log(v);
    });
  }
}
