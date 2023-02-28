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
import { CreateXmlComponent } from './create-xml/create-xml.component';
import { SettingsUserComponent } from './settings-user/settings-user.component';
import { TaxesComponent } from './taxes/taxes.component';
import { ReceiversComponent } from './settings-user/receivers/receivers.component';
import { CertificatesComponent } from './settings-user/certificates/certificates.component';
import { XmlCertificateComponent } from './create-xml/xml-certificate/xml-certificate.component';
import { XmlVaucherComponent } from './create-xml/xml-vaucher/xml-vaucher.component';
import { XmlReceiverComponent } from './create-xml/xml-receiver/xml-receiver.component';
import { XmlConceptsComponent } from './create-xml/xml-concepts/xml-concepts.component';
import { ConceptsComponent } from './taxes/concepts/concepts.component';
import { EmployeComponent } from './employe/employe.component';
import { XmlPreviewComponent } from './create-xml/xml-preview/xml-preview.component';
import { MassiveDownloadComponent } from './massive-download/massive-download.component';
import { PdfPreviewComponent } from './welcome/pdf-preview/pdf-preview.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

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
    EmployeComponent,
    XmlPreviewComponent,
    MassiveDownloadComponent,
    PdfPreviewComponent
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
