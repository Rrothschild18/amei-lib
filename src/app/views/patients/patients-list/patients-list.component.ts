import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  last,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Entities } from 'src/app/store/entities/entities.namespace';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss'],
})
export class PatientsListComponent implements OnInit {
  displayedColumns!: string[];

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {}

  fetchSuccess(payload: any): void {
    this.displayedColumns = Object.keys(payload.fields);
  }

  toArrayFields(fields: any = {}): string[] {
    return ['name', 'lastName', 'document', 'email', 'phone'];
  }

  patientColumns(): string[] {
    return ['name', 'lastName', 'document', 'email', 'phone', 'actions'];
  }

  redirectToEdit(uuid: string): void {
    this.router.navigate([`/patients/${uuid}/edit`]);
  }
}
