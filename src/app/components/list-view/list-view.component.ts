import {
  Component,
  OnInit,
  ContentChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
  ApplicationRef,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { Entities } from 'src/app/store/entities/entities.namespace';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent implements OnInit {
  @ContentChild('header') header!: TemplateRef<unknown>;
  @ContentChild('body') body!: TemplateRef<unknown>;
  @Input('url') url!: string;
  @Input('entity') entity!: any;

  fields$!: Observable<any>;
  results$!: Observable<any>;

  isFetching: boolean = false;

  @Output() fetchSuccess: EventEmitter<any> = new EventEmitter();
  @Output() fetchError: EventEmitter<any> = new EventEmitter();

  constructor(private store: Store, private appRef: ApplicationRef) {
    this.fields$ = this.store.select((state: any) => {
      return state[this.entity].fields;
    });

    this.results$ = this.store.select(
      (state: any) => state[this.entity].results
    );

    this.appRef.isStable.pipe(first((stable) => stable)).subscribe(() => {
      type EntityKey = keyof typeof Entities;
      this.store.dispatch(
        new Entities[this.entity as EntityKey].FetchAllEntities()
      );
    });
  }

  ngOnInit(): void {}

  hasBodySlot(): boolean {
    return !!this.body;
  }

  hasHeaderSlot(): boolean {
    return !!this.header;
  }

  hasResults() {
    return !!(this.results$ || []);
  }

  renderHeaderSlot(): TemplateRef<unknown> {
    return this.header;
  }

  renderBodySlot(): TemplateRef<unknown> {
    return this.body;
  }
}
