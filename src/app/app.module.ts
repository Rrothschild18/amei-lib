import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
// import { HeaderDirective } from './components/list-view/header.directive';
import { ListViewComponent } from './components/list-view/list-view.component';
// import { CardBodyDirective } from './directives/card-body.directive';
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
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { EmployeeFormComponent } from './views/employees/employee-form/employee-form.component';
import { FormComponent } from './components/form/form.component';
import { CalendarOverviewComponent } from './views/calendar-overview/calendar-overview.component';
import { CalendarMonthComponent } from './views/calendar-month/calendar-month.component';
import { FinancialAccountFormComponent } from './views/financial-accounts/financial-account-form/financial-account-form.component';
import { FinancialAccountFormTwoComponent } from './views/financial-accounts/financial-account-form-two/financial-account-form-two.component';
import { FilterObjectPipe } from './pipes/filter-object.pipe';
import { PatientFormTwoComponent } from './views/patients/patient-form-two/patient-form-two/patient-form-two.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {
  validation: true,
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LayoutComponent,
    CardComponent,
    CardTemplateComponent,
    // CardBodyDirective,
    NgTemplateNameDirective,
    FormGeneratorComponent,
    ListViewComponent,
    // HeaderDirective,
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
    NewsletterComponent,
    EmployeeFormComponent,
    FormComponent,
    CalendarOverviewComponent,
    CalendarMonthComponent,
    FinancialAccountFormComponent,
    FinancialAccountFormTwoComponent,
    FilterObjectPipe,
    PatientFormTwoComponent,
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
    NgxMaskModule.forRoot(options),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
