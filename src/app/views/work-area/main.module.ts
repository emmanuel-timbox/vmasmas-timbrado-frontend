import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@NgModule({
  declarations: [
    WelcomeComponent,
    MainComponent,
    CreateXmlComponent,
    SettingsUserComponent,
    TaxesComponent,
    ReceiversComponent,
    CertificatesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FragmentsTemplateModule,
    NgWizardModule,
    DataTablesModule,
    NgxDropzoneModule,
    NgSelect2Module,
    InputMaskModule.forRoot({ inputSelector: 'input', isAsync: true })
  ],
  exports: [
    WelcomeComponent,
    MainComponent
  ]
})

export class MainModule { }
