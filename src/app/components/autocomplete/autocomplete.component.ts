import {
  debounceTime,
  map,
  tap,
  BehaviorSubject,
  first,
  of,
  combineLatest,
  combineLatestAll,
  zip,
  Subscription,
  iif,
} from 'rxjs';
import { Observable, startWith, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import {
  FloatLabelType,
  MatFormFieldAppearance,
} from '@angular/material/form-field';
import { AutocompleteOption } from './multiselect-autocomplete.interface';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements OnInit {
  @Input() placeholder!: string;
  @Input() appearance: MatFormFieldAppearance = 'fill';
  @Input() floatingLabel: FloatLabelType = 'always';
  @Input() selectAllOption: boolean = true;
  @Input() data: AutocompleteOption[] = [];

  // data: AutocompleteOption[] = [];

  @Output() selectedOptions = new EventEmitter<
    Observable<AutocompleteOption[]>
  >();

  filteredOptionsByUser$!: Observable<AutocompleteOption[]>;
  searchControl: FormControl = new FormControl('');
  lastSearchValue: string | null = null;
  isLoading: boolean = false;

  currentOptions$ = new BehaviorSubject<AutocompleteOption[]>([]);

  currentSelectedOptions$ = new BehaviorSubject<AutocompleteOption[]>([]);

  // selectedData: AutocompleteOption[] = [];
  // selectedDataIds: Array<string | number> = [];
  uniqueSelectedDataIds: Set<string | number> = new Set();

  allSelected$: Observable<boolean> = this.onSelectChange();

  constructor() {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        tap((searchControlValue) => {
          this.isLoading = true;
          this.lastSearchValue = searchControlValue;
        }),
        startWith(''),
        debounceTime(2000),
        map((searchControlValue) => {
          const search =
            typeof searchControlValue === 'string'
              ? searchControlValue
              : searchControlValue.label;

          return search ? this._filter(search as string) : this.data.slice();
        }),

        tap((currentOptions) => {
          currentOptions = currentOptions.map((option: AutocompleteOption) => ({
            ...option,
            selected: this.currentSelectedDataIds.includes(option.value),
          }));

          this.currentOptions$.next(currentOptions);

          this.isLoading = false;
        })
      )
      .subscribe();
  }

  get currentOptionsIds(): Array<number | string> {
    return this.currentOptions$.value.map(
      (option: AutocompleteOption) => option.value
    );
  }

  get currentSelectedDataIds(): Array<number | string> {
    return this.currentSelectedOptions$.value.map(
      (option: AutocompleteOption) => option.value
    );
  }

  //Warning: edit mode maybe dont have those IDs at data
  get updatedOptionsToEmit(): AutocompleteOption[] {
    const allSelected = this.data?.filter((option: any) =>
      [...this.uniqueSelectedDataIds].find(
        (selectedId) => selectedId === option.value
      )
    );

    return allSelected.map((option: AutocompleteOption) => ({
      ...option,
      selected: true,
    }));
  }

  get selectedAllFalse(): AutocompleteOption[] {
    return this.data?.map((option: AutocompleteOption) => ({
      ...option,
      selected: false,
    }));
  }

  //Delete
  get currentSelectedIdsHTML(): string {
    return this.currentSelectedDataIds.map((v) => v).join(',');
  }

  onSelectChange(): Observable<boolean> {
    return combineLatest([
      this.currentSelectedOptions$,
      this.currentOptions$,
    ]).pipe(
      map(([currentSelectedOptions, _]) => {
        if (!currentSelectedOptions.length) {
          return false;
        }

        return this.isSuperset(
          new Set(...[this.currentSelectedDataIds]),
          new Set(...[this.currentOptionsIds])
        );
      })
    );
  }

  ngOnChanges() {}

  private _filter(label: string): AutocompleteOption[] {
    const filterValue = label.toLowerCase();

    return this.data.filter((option: any) =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  trackBy(index: number, item: AutocompleteOption) {
    return item.value;
  }

  onAddOption(optionId: string | number, event: MouseEvent) {
    event.stopPropagation();

    if (this.uniqueSelectedDataIds.has(optionId)) {
      //Always update the Set of IDs
      this.uniqueSelectedDataIds.delete(optionId);

      this.currentSelectedOptions$.next([...this.updatedOptionsToEmit]);

      //Event Emitter
      this.selectedOptions.next(this.currentSelectedOptions$.asObservable());

      return;
    }

    //Always update the Set of IDs
    this.uniqueSelectedDataIds.add(optionId);

    this.currentSelectedOptions$.next([...this.updatedOptionsToEmit]);

    //Event Emitter
    this.selectedOptions.next(this.currentSelectedOptions$.asObservable());

    return;
  }

  onSelectAll() {
    let newUniqueIds = this.symmetricDifference(
      new Set(...[this.currentOptionsIds]),
      this.uniqueSelectedDataIds
    );

    const allSelected = this.currentOptions$
      .getValue()
      .every((option) => this.currentSelectedDataIds.includes(option.value));

    debugger;

    if (newUniqueIds.size === 0) {
      this.data.map((option) => ({
        ...option,
        selected: this.currentSelectedDataIds.includes(option.value),
      }));

      //Added merged selected Options
      this.currentSelectedOptions$.next([]);

      //Update currentOptions as selected
      this.currentOptions$.next([
        ...this.currentOptions$.getValue().map((option) => {
          if (option.selected) delete option.selected;

          return option;
        }),
      ]);

      //Event Emitter
      this.selectedOptions.next(of([]));

      this.uniqueSelectedDataIds = newUniqueIds;
    } else {
      debugger;

      if (!allSelected)
        this.uniqueSelectedDataIds = new Set([
          ...this.uniqueSelectedDataIds,
          ...newUniqueIds,
        ]);

      const v = [...this.updatedOptionsToEmit];
      //Added merged selected Options
      this.currentSelectedOptions$.next([...this.updatedOptionsToEmit]);

      //Update currentOptions as selected
      this.currentOptions$.next([...this.updatedOptionsToEmit]);

      //Event Emitter
      this.selectedOptions.next(this.currentSelectedOptions$.asObservable());
    }
  }

  symmetricDifference(setA: Set<number | string>, setB: Set<number | string>) {
    const difference = new Set(setA);

    for (const elem of setB) {
      if (difference.has(elem)) {
        difference.delete(elem);
      } else {
        difference.add(elem);
      }
    }

    return difference;
  }

  isSuperset(set: Set<number | string>, subset: Set<number | string>) {
    for (const elem of subset) {
      if (!set.has(elem)) {
        return false;
      }
    }

    return true;
  }
}

//fix/Autocomplete-multiselect-fixes
