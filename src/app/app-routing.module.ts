import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { PatientFormComponent } from './views/patients/patient-form/patient-form.component';
import { PatientsListComponent } from './views/patients/patients-list/patients-list.component';
import { ProfessionalFormComponent } from './views/professionals/professionals-form/professional-form.component';
import { ProfessionalsListComponent } from './views/professionals/professionals-list/professionals-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'patients', component: PatientsListComponent },
  { path: 'professionals', component: ProfessionalsListComponent },
  { path: 'professionals/new', component: ProfessionalFormComponent },
  { path: 'patients/new', component: PatientFormComponent },
  { path: 'patients/:id/edit', component: PatientFormComponent },
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
