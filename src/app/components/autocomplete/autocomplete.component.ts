import { debounceTime, map, tap } from 'rxjs';
import { distinctUntilChanged } from 'rxjs';
import { Observable, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import {
  FloatLabelType,
  MatFormFieldAppearance,
} from '@angular/material/form-field';
import {
  AutocompleteData,
  AutocompleteOption,
} from './multiselect-autocomplete.interface';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements OnInit {
  @Input('placeholder') placeholder!: string;
  @Input('appearance') appearance: MatFormFieldAppearance = 'fill';
  @Input('floatingLabel') floatingLabel: FloatLabelType = 'always';
  @Input('selectAllOption') selectAllOption: boolean = true;
  @Input() data: any = [];

  filteredOptionsByUser$!: Observable<AutocompleteData>;
  searchControl: FormControl = new FormControl('');
  lastSearchValue: string | null = null;
  isLoading: boolean = false;

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

  private _filter(label: string): AutocompleteData {
    const filterValue = label.toLowerCase();

    return this.data.filter((option: any) =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  trackBy(index: number, item: AutocompleteOption) {
    return item.value;
  }
}
