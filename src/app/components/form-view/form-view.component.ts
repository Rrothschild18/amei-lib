import { FormGeneratorComponent } from './../form-generator/form-generator.component';
import { first, map, Observable, Subject } from 'rxjs';
import {
  ApplicationRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { Entities } from 'src/app/store/entities/entities.namespace';
import { FormValue, FormViewService } from './form-view.service';

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss'],
  providers: [FormViewService],
})
export class FormViewComponent implements OnInit {
  @Input('entity') entity!: string;
  @ContentChild('header') header!: TemplateRef<unknown>;
  @ContentChild('body') body!: TemplateRef<unknown>;

  result$!: Observable<any>;
  fields$!: Observable<any>;
  isFetching: boolean = false;

  values: any = {};
  componentStore$: Observable<FormValue> = this.formView.formValues;

  @Output() fetchSuccess: EventEmitter<any> = new EventEmitter();
  @Output() fetchError: EventEmitter<any> = new EventEmitter();
  @ViewChildren(FormGeneratorComponent)
  formRefs!: QueryList<FormGeneratorComponent>;

  constructor(
    private store: Store,
    private appRef: ApplicationRef,
    private formView: FormViewService
  ) {}

  ngOnInit(): void {
    this.fields$ = this.store.select((state: any) => {
      return state[this.entity].fields;
    });

    this.result$ = this.store.select(
      (state: any) => state[this.entity].results
    );

    this.appRef.isStable.pipe(first((stable) => stable)).subscribe(() => {
      type EntityKey = keyof typeof Entities;
      this.store.dispatch(
        new Entities[this.entity as EntityKey].FetchAllEntities()
      );
    });

    this.componentStore$.subscribe(({ fieldName, value }: FormValue) => {
      try {
        if (fieldName && value) {
          this.values = { ...this.values, [fieldName]: value };
        }
      } catch (e) {
        throw new Error('Form Error');
      }
    });
  }

  ngOnDestroy() {}

  get formStoreChange() {
    return this.formView;
  }

  hasBodySlot(): boolean {
    return !!this.body;
  }

  hasHeaderSlot(): boolean {
    return !!this.header;
  }

  hasResults() {
    return !!(this.result$ || []);
  }

  renderHeaderSlot(): TemplateRef<unknown> {
    return this.header;
  }

  renderBodySlot(): TemplateRef<unknown> {
    return this.body;
  }

  // async fetchForm() {
  //   this.isFetching = true;

  //   try {
  //     let { fields, result } = await this.ls.getPatientCreate();

  //     this.fields$ = fields;
  //     this.result$ = result;

  //     this.fetchSuccess.emit({ results: this.result$, fields: this.fields$ });
  //   } catch (e) {
  //     this.fetchError.emit(e);
  //   } finally {
  //     this.isFetching = false;
  //   }
  // }
}
