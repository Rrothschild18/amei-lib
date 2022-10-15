import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss'],
})
export class PatientsListComponent implements OnInit {
  displayedColumns!: string[];

  constructor(private router: Router) {}

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
}
