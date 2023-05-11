import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InputMaskModule } from '@ngneat/input-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { NgSelect2Module } from 'ng-select2';
import { NgWizardModule } from 'ng-wizard';
import { DataTablesModule } from "angular-datatables";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AuthInterceptor } from '../../interceptors/HttpErrorInterceptor'
import { WelcomeComponent } from './welcome/welcome.component';
import { MainComponent } from './main.component';
import { FragmentsTemplateModule } from './../fragments-template/fragments-template.module';
import { CreateXmlComponent } from './xmls/create-xml/create-xml.component';
import { SettingsUserComponent } from './settings-user/settings-user.component';
import { TaxesComponent } from './taxes/taxes.component';
import { ReceiversComponent } from './settings-user/receivers/receivers.component';
import { CertificatesComponent } from './settings-user/certificates/certificates.component';
import { XmlCertificateComponent } from './xmls/create-xml/xml-certificate/xml-certificate.component';
import { XmlVaucherComponent } from './xmls/create-xml/xml-vaucher/xml-vaucher.component';
import { XmlReceiverComponent } from './xmls/create-xml/xml-receiver/xml-receiver.component';
import { XmlConceptsComponent } from './xmls/create-xml/xml-concepts/xml-concepts.component';
import { ConceptsComponent } from './taxes/concepts/concepts.component';
import { EmployeeComponent } from './employee/employee.component';
import { XmlPreviewComponent } from './xmls/create-xml/xml-preview/xml-preview.component';
import { MassiveDownloadComponent } from './massive-download/massive-download.component';
import { PdfPreviewComponent } from './welcome/pdf-preview/pdf-preview.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CompanyImageComponent } from './company-image/company-image.component';
import { CreateXmlPayrollComponent } from './xmls/create-xml-payroll/create-xml-payroll.component';
import { XmlDataPayrollComponent } from './xmls/create-xml-payroll/xml-data-payroll/xml-data-payroll.component';
import { XmlDataPerceptionsComponent } from './xmls/create-xml-payroll/xml-data-perceptions/xml-data-perceptions.component';
import { XmlDataDeductionsComponent } from './xmls/create-xml-payroll/xml-data-deductions/xml-data-deductions.component';
import { XmlDataOtherPaymentsComponent } from './xmls/create-xml-payroll/xml-data-other-payments/xml-data-other-payments.component';
import { XmDataReceiverPayrollComponent } from './xmls/create-xml-payroll/xm-data-receiver-payroll/xm-data-receiver-payroll.component';

@NgModule({
  declarations: [
    WelcomeComponent,
    MainComponent,
    CreateXmlComponent,
    SettingsUserComponent,
    TaxesComponent,
    ReceiversComponent,
    CertificatesComponent,
    XmlCertificateComponent,
    XmlVaucherComponent,
    XmlReceiverComponent,
    XmlConceptsComponent,
    ConceptsComponent,
    EmployeeComponent,
    XmlPreviewComponent,
    MassiveDownloadComponent,
    PdfPreviewComponent,
    CompanyImageComponent,
    CreateXmlPayrollComponent,
    XmlDataPayrollComponent,
    XmlDataPerceptionsComponent,
    XmlDataDeductionsComponent,
    XmlDataOtherPaymentsComponent,
    XmDataReceiverPayrollComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FragmentsTemplateModule,
    NgWizardModule,
    DataTablesModule,
    NgxDropzoneModule,
    NgSelect2Module,
    HttpClientModule,
    InputMaskModule.forRoot({ inputSelector: 'input', isAsync: true }),
    ReactiveFormsModule,
    FormsModule,
    QRCodeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ],
  exports: [
    MainComponent
  ]
})

export class MainModule { }
