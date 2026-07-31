import { FilterObjectPipe } from './../../pipes/filter-object.pipe';
import { Injectable, OnDestroy, QueryList } from '@angular/core';
import { BehaviorSubject, Subject, Observable, map, combineLatest } from 'rxjs';
import { FormGeneratorComponent } from '../form-generator/form-generator.component';
import { FormComponent } from '../form/form.component';

export interface FormValue {
  [key: string]: any;
}

@Injectable()
export class FormViewService implements OnDestroy {
  private values$ = new BehaviorSubject<FormValue>({});

  private formRefs$ = new Subject<
    QueryList<FormGeneratorComponent | FormComponent>
  >();

  private formsKeys$ = new BehaviorSubject<
    Record<string, { [key: string]: any }>
  >({});

  constructor(private filterObject: FilterObjectPipe) {}

  get formValues(): BehaviorSubject<FormValue> {
    return this.values$;
  }

  get formValues2(): Observable<FormValue> {
    return combineLatest({
      keys: this.formsKeys$.pipe(
        map((keys) => Object.values(keys).flat() as unknown as string[])
      ),
      values: this.values$,
    }).pipe(
      map(({ keys, values }) =>
        this.filterObject.transform<any>(values || {}, keys || [])
      )
    );
  }

  get formRefs(): Observable<
    QueryList<FormGeneratorComponent | FormComponent>
  > {
    return this.formRefs$.asObservable();
  }

  onFormChanges(emittedFormValue: { [key: string]: any }) {
    this.values$.next({ ...this.values$.getValue(), ...emittedFormValue });
  }

  setFormRefs(forms: QueryList<FormGeneratorComponent | FormComponent>) {
    this.formRefs$.next(forms);
  }

  ngOnDestroy() {
    this.values$.unsubscribe();
    this.formRefs$.unsubscribe();
  }

  setFormKeys<T>(formName: string, keys: (keyof T)[]) {
    const currentState = this.formsKeys$.getValue();

    this.formsKeys$.next({ ...currentState, [formName]: keys });
  }
}
