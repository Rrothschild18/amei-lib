import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ListViewService } from 'src/app/services/list-view.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
})
export class PatientFormComponent implements OnInit {
  form!: FormGroup;
  values: any;
  arrayFields$: any;

  // @Select(PatientState.fields) fields$!: Observable<any>;

  constructor(private ls: ListViewService, private store: Store) {}

  async ngOnInit(): Promise<any> {
    await this.getFields();
  }

  async getFields(): Promise<any> {
    let { fields } = await this.ls.getPatientCreate();
    this.arrayFields$ = fields;
  }

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

  patientPersonalFields(): string[] {
    return ['name', 'lastname', 'email'];
  }

  patientAdditionalFields(): string[] {
    return ['phone', 'games', 'lang'];
  }

  handleFormValues(event: any) {
    this.values = { ...this.values, ...event };
  }
}
