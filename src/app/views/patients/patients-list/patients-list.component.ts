import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss'],
})
export class PatientsListComponent implements OnInit {
  displayedColumns!: string[];

  constructor() {}

  ngOnInit(): void {}

  fetchSuccess(payload: any): void {
    this.displayedColumns = Object.keys(payload.fields);
  }

  toArrayFields(fields: any = {}): string[] {
    console.log(Object.keys(fields));
    return Object.keys(fields);
  }

  patientColumns(): string[] {
    return ['name', 'lastname', 'email', 'phone', 'gender', 'document'];
  }

  redirectToSingle(): string[] {
    return ['name', 'lastname', 'email', 'phone', 'gender', 'document'];
  }
}
