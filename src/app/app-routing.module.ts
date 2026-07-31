import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { PatientFormComponent } from './views/patients/patient-form/patient-form.component';
import { PatientsListComponent } from './views/patients/patients-list/patients-list.component';
import { ProfessionalProceduresComponent } from './views/professional-procedures/professional-procedures.component';
import { ProfessionalFormComponent } from './views/professionals/professionals-form/professional-form.component';
import { ProfessionalsListComponent } from './views/professionals/professionals-list/professionals-list.component';
import { EmployeeFormComponent } from './views/employees/employee-form/employee-form.component';
import { CalendarOverviewComponent } from './views/calendar-overview/calendar-overview.component';
import { CalendarMonthComponent } from './views/calendar-month/calendar-month.component';
import { FinancialAccountFormComponent } from './views/financial-accounts/financial-account-form/financial-account-form.component';
import { FinancialAccountFormTwoComponent } from './views/financial-accounts/financial-account-form-two/financial-account-form-two.component';
import { PatientFormTwoComponent } from './views/patients/patient-form-two/patient-form-two/patient-form-two.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'patients', component: PatientsListComponent },
  { path: 'professionals', component: ProfessionalsListComponent },
  {
    path: 'professionals/:id/procedures',
    component: ProfessionalProceduresComponent,
  },
  { path: 'professionals/new', component: ProfessionalFormComponent },
  { path: 'patients/new', component: PatientFormTwoComponent },
  { path: 'patients/:id/edit', component: PatientFormTwoComponent },

  { path: 'employees/new', component: EmployeeFormComponent },
  { path: 'calendar', component: CalendarOverviewComponent },
  { path: 'calendar-month', component: CalendarOverviewComponent },
  { path: 'financial-accounts/new', component: FinancialAccountFormComponent },
  {
    path: 'financial-accounts-two/new',
    component: FinancialAccountFormTwoComponent,
  },
  {
    path: 'financial-accounts-two/:id/edit',
    component: FinancialAccountFormTwoComponent,
  },
];

@NgModule({
  imports: [
    MaterialModule,
    RouterModule.forRoot(routes),
    NgxsDispatchPluginModule.forRoot(),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
