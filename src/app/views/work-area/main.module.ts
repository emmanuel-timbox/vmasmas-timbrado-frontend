import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WelcomeComponent } from './welcome/welcome.component';
import { MainComponent } from './main.component';
import { FragmentsTemplateModule } from './../fragments-template/fragments-template.module';
import { CreateXmlComponent } from './create-xml/create-xml.component';
import { NgWizardModule } from 'ng-wizard';
import { SettingsUserComponent } from './settings-user/settings-user.component';
import { DataTablesModule } from "angular-datatables";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TaxesComponent } from './taxes/taxes.component';
import { NgSelect2Module } from 'ng-select2';
import { ReceiversComponent } from './settings-user/receivers/receivers.component';
import { CertificatesComponent } from './settings-user/certificates/certificates.component';
import { InputMaskModule } from '@ngneat/input-mask';
import { AuthInterceptor } from '../../interceptors/HttpErrorInterceptor'
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule }   from '@angular/forms';
import { XmlCertificateComponent } from './create-xml/xml-certificate/xml-certificate.component';
import { XmlVaucherComponent } from './create-xml/xml-vaucher/xml-vaucher.component';
import { XmlReceiverComponent } from './create-xml/xml-receiver/xml-receiver.component';
import { XmlConceptsComponent } from './create-xml/xml-concepts/xml-concepts.component';

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
    XmlConceptsComponent
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
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  exports: [
    WelcomeComponent,
    MainComponent
  ]
})

export class MainModule { }
