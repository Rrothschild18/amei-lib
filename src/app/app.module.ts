import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardTemplateComponent } from './components/card-template/card-template.component';
import { CardComponent } from './components/card/card.component';
import { FieldComponent } from './components/field/field.component';
import { FormGeneratorComponent } from './components/form-generator/form-generator.component';
import { FormViewComponent } from './components/form-view/form-view.component';
import { HeaderDirective } from './components/list-view/header.directive';
import { ListViewComponent } from './components/list-view/list-view.component';
import { CardBodyDirective } from './directives/card-body.directive';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from './material/material.module';
import { PatientState } from './store/patients/patient.state';
import { ProfessionalState } from './store/professionals/professional.state';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { PatientFormComponent } from './views/patients/patient-form/patient-form.component';
import { PatientsListComponent } from './views/patients/patients-list/patients-list.component';
import { ProfessionalsListComponent } from './views/professionals/professionals-list/professionals-list.component';
import { ListTestComponent } from './components/list-test/list-test.component';
import { NgTemplateNameDirective } from './directives/ng-template-name.directive';
import { NestedFieldsComponent } from './components/nested-fields/nested-fields.component';
import { ProfessionalFormComponent } from './views/professionals/professionals-form/professional-form.component';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { ProfessionalProceduresComponent } from './views/professional-procedures/professional-procedures.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LayoutComponent,
    CardComponent,
    CardTemplateComponent,
    CardBodyDirective,
    NgTemplateNameDirective,
    FormGeneratorComponent,
    ListViewComponent,
    HeaderDirective,
    PatientsListComponent,
    PatientFormComponent,
    FieldComponent,
    FormViewComponent,
    ProfessionalsListComponent,
    ListTestComponent,
    NestedFieldsComponent,
    ProfessionalFormComponent,
    AutocompleteComponent,
    ProfessionalProceduresComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxsModule.forRoot([PatientState, ProfessionalState], {
      developmentMode: true,
    }),
    NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
