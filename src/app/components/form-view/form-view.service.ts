import { Injectable, QueryList, ViewChildren } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { FormGeneratorComponent } from '../form-generator/form-generator.component';
import { FormComponent } from '../form/form.component';

export interface FormValue {
  [key: string]: any;
}

@Injectable()
export class FormViewService {
  private values$ = new BehaviorSubject<FormValue>({});

  private formRefs$ = new Subject<
    QueryList<FormGeneratorComponent | FormComponent>
  >();

  constructor() {}

  get formValues(): Subject<FormValue> {
    return this.values$;
  }

  get formRefs(): Observable<
    QueryList<FormGeneratorComponent | FormComponent>
  > {
    return this.formRefs$.asObservable();
  }

  onFormChanges(emittedFormValue: { [key: string]: any }) {
    this.values$.next(emittedFormValue);
  }

  setFormRefs(forms: QueryList<FormGeneratorComponent | FormComponent>) {
    this.formRefs$.next(forms);
    debugger;
  }

  ngOnDestroy() {
    this.values$.unsubscribe();
  }
}
