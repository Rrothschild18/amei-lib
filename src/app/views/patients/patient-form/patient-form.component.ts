import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
})
export class PatientFormComponent implements OnInit {
  form!: FormGroup;
  values: any;

  constructor() {}

  get patientAdditionalColumns() {
    return {
      phone: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      games: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      lang: {
        lg: 4,
        md: 6,
        sm: 12,
      },
      season: {
        lg: 12,
      },
      checkin: {
        lg: 4,
        md: 6,
        sm: 12,
      },
    };
  }

  get patientPersonalColumns() {
    return {
      name: {
        col: 4,
      },
      lastname: {
        col: 4,
      },
      email: {
        col: 4,
      },
    };
  }

  get patientPersonalValidators() {
    return {
      name: [Validators.required],
      lastname: [Validators.required],
      email: [Validators.required, Validators.email, Validators.maxLength(20)],
    };
  }

  get patientAdditionalValidators() {
    return {
      phone: [Validators.required],
      games: [Validators.required],
      lang: [Validators.required],
      season: [Validators.required],
      checkin: [Validators.required],
    };
  }

  get patientAdditionalFields(): string[] {
    return ['phone', 'games', 'lang', 'checkin', 'season'];
  }

  get patientPersonalFields(): string[] {
    return ['name', 'lastname', 'email'];
  }

  async ngOnInit(): Promise<any> {
    // await this.getFields();
  }

  // async getFields(): Promise<any> {
  //   let { fields } = await this.ls.getPatientCreate();
  //   this.arrayFields$ = fields;
  // }

  hasFields(fields: {}) {
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
}
