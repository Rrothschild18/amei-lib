import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface FormValue {
  [key: string]: any;
}

@Injectable()
export class FormViewService {
  private values$: Subject<FormValue> = new BehaviorSubject<FormValue>({});

  constructor() {}

  get formValues(): Subject<FormValue> {
    return this.values$;
  }

  onFormChanges(emittedFormValue: { [key: string]: any }) {
    this.values$.next(emittedFormValue);
  }

  ngOnDestroy() {
    this.values$.unsubscribe();
  }
}
