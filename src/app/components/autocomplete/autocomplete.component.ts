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
} from 'rxjs';
import { Observable, startWith } from 'rxjs';
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
  @Input() data: any = [];

  @Output() selectedOptions = new EventEmitter<
    Observable<AutocompleteOption[]>
  >();

  filteredOptionsByUser$!: Observable<AutocompleteOption[]>;
  searchControl: FormControl = new FormControl('');
  lastSearchValue: string | null = null;
  isLoading: boolean = false;

  currentOptions$: BehaviorSubject<AutocompleteOption[]> = new BehaviorSubject<
    AutocompleteOption[]
  >([]);

  currentSelectedOptions$: BehaviorSubject<AutocompleteOption[]> =
    new BehaviorSubject<AutocompleteOption[]>([]);

  selectedData: AutocompleteOption[] = [];
  selectedDataIds: Array<string | number> = [];
  uniqueSelectedDataIds: Set<string | number> = new Set();

  allSelected: Observable<boolean> = combineLatest([
    this.currentSelectedOptions$,
    this.currentOptions$,
  ]).pipe(
    map(([currentSelectedOptions, currentOptions]) => {
      let currentOptionsIds = currentSelectedOptions.map(
        (option) => option.value
      );

      if (!currentSelectedOptions.length) {
        return false;
      }
      return currentOptions.every((currentOption) =>
        currentOptionsIds.includes(currentOption.value)
      );
    })
  );

  constructor() {}

  ngOnInit(): void {
    this.filteredOptionsByUser$ = this.searchControl.valueChanges.pipe(
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
        this.currentOptions$.next(currentOptions);
        this.isLoading = false;
      })
    );
  }

  get currentOptionsIds(): Array<number | string> {
    return this.currentOptions$.value.map(
      (option: AutocompleteOption) => option.value
    );
  }

  // get currentUserFilteredOptionsIds(): Array<number | string> {
  //   return this.currentSelectedOptions$.value.map(
  //     (option: AutocompleteOption) => option.value
  //   );
  // }

  get currentSelectedDataIds(): Array<number | string> {
    return this.currentSelectedOptions$.value.map(
      (option: AutocompleteOption) => option.value
    );
  }

  //Warning: edit mode maybe dont have those IDs at data
  get updatedOptionsToEmit(): AutocompleteOption[] {
    return this.data?.filter((option: any) =>
      [...this.uniqueSelectedDataIds].find(
        (selectedId) => selectedId === option.value
      )
    );
  }

  //Delete
  get currentSelectedIdsHTML(): string {
    return this.currentSelectedDataIds.map((v) => v).join(',');
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

  onAddOption(optionId: string | number) {
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
    if (this.allSelected) {
      let newUniqueIds = this.symmetricDifference(
        new Set(...[this.currentOptionsIds]),
        this.uniqueSelectedDataIds
      );
      debugger;

      //Set new ids
      this.uniqueSelectedDataIds = newUniqueIds;

      this.currentSelectedOptions$.next([...this.updatedOptionsToEmit]);

      //Event Emitter
      this.selectedOptions.next(this.currentSelectedOptions$.asObservable());

      return;
    }

    /**
     * If exist any filtered option by user thats not selected, it implies that he wants to select all.
     *
     * allSelected = false
     */

    if (!this.allSelected) {
      const v = this.currentSelectedDataIds;
      const vv = this.currentOptionsIds;
      //Update array of IDs
      this.uniqueSelectedDataIds = new Set(
        ...new Array([
          ...this.currentSelectedDataIds,
          ...this.currentOptionsIds,
        ])
      );

      debugger;
      //Updates selected options
      this.currentSelectedOptions$.next([...this.updatedOptionsToEmit]);

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

    debugger;

    return difference;
  }

  isSelected(optionId: number | string): Observable<boolean> {
    const v = this.currentSelectedDataIds.includes(optionId);

    return zip([
      of(optionId),
      this.currentSelectedOptions$.asObservable(),
    ]).pipe(
      map(([optionId, currentSelectedOptions]) => {
        const c = v;
        debugger;

        return currentSelectedOptions
          .map((option) => option.value)
          .includes(optionId);
      })
    );
  }
}

//fix/Autocomplete-multiselect-fixes
