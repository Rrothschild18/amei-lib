import { first, Observable } from 'rxjs';
import {
  ApplicationRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { Entities } from 'src/app/store/entities/entities.namespace';

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

  @Output() fetchSuccess: EventEmitter<any> = new EventEmitter();
  @Output() fetchError: EventEmitter<any> = new EventEmitter();

  constructor(private store: Store, private appRef: ApplicationRef) {}

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
