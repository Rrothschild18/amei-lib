import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss'],
})
export class PatientsListComponent implements OnInit {
  displayedColumns!: string[];
  searchValue: string = '';

  filters: FormGroup = new FormGroup({
    email: new FormControl(''),
    phone: new FormControl(''),
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  fetchSuccess(payload: any): void {
    this.displayedColumns = Object.keys(payload.fields);
  }

  toArrayFields(fields: any = {}): string[] {
    console.log(Object.keys(fields));
    return ['name', 'lastName', 'email', 'phone'];
  }

  patientColumns(): string[] {
    return ['name', 'lastName', 'email', 'phone', 'actions'];
  }

  redirectToEdit(uuid: string): void {
    this.router.navigate([`/patients/${uuid}/edit`]);
  }

  handleFilter() {
    this.router.navigate([], {
      queryParams: this.filters.value,
      relativeTo: this.activeRoute,
    });
  }

  clearFilters() {
    this.router.navigate([], {
      //Trim blank spaces and set them to undefined || delete key
      queryParams: {},
      relativeTo: this.activeRoute,
    });
  }
}
