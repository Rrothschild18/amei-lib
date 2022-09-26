import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export interface FormValue {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class FormViewService {
  private values$ = new BehaviorSubject<FormValue>({});

  constructor() {}

  get formValues(): Observable<FormValue> {
    return this.values$;
  }

  onFormChanges(emittedFormValue: { [key: string]: any }) {
    this.values$.next(emittedFormValue);
  }

  ngOnDestroy() {
    console.log('destroy');
    this.values$.unsubscribe();
  }
}
