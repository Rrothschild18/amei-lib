import { Observable } from 'rxjs';
import {
  Component,
  ContentChild,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { ListViewService } from 'src/app/services/list-view.service';

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss'],
})
export class FormViewComponent implements OnInit {
  @ContentChild('header') header!: TemplateRef<unknown>;
  @ContentChild('body') body!: TemplateRef<unknown>;
  // @Input('url') url!: string;
  // @Input('entity') entity!: string;

  // @Select(PatientState.fields) fields$!: Observable<any>;
  // @Select(PatientState.results) results$!: Observable<any>;
  // results$ = this.store.select((state) => state.patient.results);
  // fields$ = this.store.select((state) => state.patient.fields);

  result$!: Observable<any>;
  fields$!: Observable<any>;
  isFetching: boolean = false;

  values: any = {};

  @Output() fetchSuccess: EventEmitter<any> = new EventEmitter();
  @Output() fetchError: EventEmitter<any> = new EventEmitter();

  constructor(private ls: ListViewService, private store: Store) {}

  ngOnInit(): void {
    this.fetchForm();
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

  async fetchForm() {
    this.isFetching = true;

    try {
      let { fields, result } = await this.ls.getPatientCreate();

      this.fields$ = fields;
      this.result$ = result;

      this.fetchSuccess.emit({ results: this.result$, fields: this.fields$ });
    } catch (e) {
      this.fetchError.emit(e);
    } finally {
      this.isFetching = false;
    }
  }
}
