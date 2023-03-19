import { Injectable, QueryList, ViewChildren } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { FormGeneratorComponent } from '../form-generator/form-generator.component';

export interface FormValue {
  [key: string]: any;
}

@Injectable()
export class FormViewService {
  private values$ = new BehaviorSubject<FormValue>({});

  private formRefs$ = new Subject<QueryList<FormGeneratorComponent>>();

  constructor() {}

  get formValues(): Subject<FormValue> {
    return this.values$;
  }

  get formRefs(): Observable<QueryList<FormGeneratorComponent>> {
    return this.formRefs$.asObservable();
  }

  onFormChanges(emittedFormValue: { [key: string]: any }) {
    this.values$.next(emittedFormValue);
  }

  setFormRefs(forms: QueryList<FormGeneratorComponent>) {
    this.formRefs$.next(forms);
  }

  ngOnDestroy() {
    this.values$.unsubscribe();
  }
}
