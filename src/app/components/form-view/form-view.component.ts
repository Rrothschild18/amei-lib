import { FormGeneratorComponent } from './../form-generator/form-generator.component';
import { first, Observable } from 'rxjs';
import {
  ApplicationRef,
  Component,
  ContentChild,
  Input,
  OnInit,
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
})
export class FormViewComponent implements OnInit {
  @Input('entity') entity!: string;
  @ContentChild('header') header!: TemplateRef<unknown>;
  @ContentChild('body') body!: TemplateRef<unknown>;

  result$!: Observable<any>;
  fields$!: Observable<any>;
  isFetching: boolean = false;

  values: any = {};
  componentStore$: Observable<FormValue> = this.formService.formValues;

  @ViewChildren(FormGeneratorComponent)
  formRefs!: QueryList<FormGeneratorComponent>;

  constructor(
    private store: Store,
    private appRef: ApplicationRef,
    private formService: FormViewService
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
      if (!fieldName && !value) {
        return {};
      }

      return (this.values = { ...this.values, [fieldName]: value });
    });
  }

  ngOnDestroy() {}

  get formStoreChange() {
    return this.formService;
  }

  get hasBodySlot(): boolean {
    return !!this.body;
  }

  get hasHeaderSlot(): boolean {
    return !!this.header;
  }

  get hasResults() {
    return !!(this.result$ || []);
  }

  renderHeaderSlot(): TemplateRef<unknown> {
    return this.header;
  }

  renderBodySlot(): TemplateRef<unknown> {
    return this.body;
  }
}
