import { debounceTime, map, tap, BehaviorSubject, first, of } from 'rxjs';
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
  filteredOptionsByUser$$!: Observable<AutocompleteOption[]>;
  searchControl: FormControl = new FormControl('');
  lastSearchValue: string | null = null;
  isLoading: boolean = false;

  // selectedData: BehaviorSubject<AutocompleteOption[]> = new BehaviorSubject<
  //   AutocompleteOption[]
  // >([]);

  selectedData: AutocompleteOption[] = [];
  selectedDataIds: Array<string | number> = [];
  uniqueSelectedDataIds: Set<string | number> = new Set();
  allSelected: boolean = false;

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

      tap(() => (this.isLoading = false))
    );
  }

  get currentFilteredDataIds(): Array<number | string> {
    return this.data.map((option: AutocompleteOption) => option.value);
  }

  get currentSelectedDataIds(): Array<number | string> {
    return this.selectedData.map((option: AutocompleteOption) => option.value);
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
      this.uniqueSelectedDataIds.delete(optionId);

      this.selectedData = this.data?.filter((option: any) =>
        [...this.uniqueSelectedDataIds].find(
          (selectedId) => selectedId === option.value
        )
      );

      this.selectedOptions.next(of(this.selectedData));
      return;
    }

    this.uniqueSelectedDataIds.add(optionId);

    this.selectedData = this.data?.filter((option: any) =>
      [...this.uniqueSelectedDataIds].find(
        (selectedId) => selectedId === option.value
      )
    );

    this.selectedOptions.next(of(this.selectedData));

    return;
  }

  onSelectAll() {
    if (this.allSelected) {
      let newIds = this.symmetricDifference(
        new Set(...new Array(this.currentFilteredDataIds)),
        this.uniqueSelectedDataIds
      );

      this.uniqueSelectedDataIds = newIds;

      this.selectedData = [
        ...this.data?.filter((option: any) =>
          [...newIds].find((selectedId) => selectedId === option.value)
        ),
      ];

      this.selectedOptions.next(of(this.selectedData));
      this.allSelected = false;
      debugger;
      return;
    }

    if (!this.allSelected) {
      debugger;
      this.selectedData = [...this.selectedData, ...this.data];
      this.selectedOptions.next(of(this.selectedData));
      this.uniqueSelectedDataIds = new Set(
        ...new Array(this.currentSelectedDataIds)
      );
      this.allSelected = true;
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
}

//fix/Autocomplete-multiselect-fixes
