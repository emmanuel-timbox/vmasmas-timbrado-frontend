
import { MainComponent } from './main.component';
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { CreateXmlComponent } from './create-xml/create-xml.component';
import { SettingsUserComponent } from './settings-user/settings-user.component';
import { TaxesComponent } from './taxes/taxes.component';
import { ReceiversComponent } from './settings-user/receivers/receivers.component';
import { CertificatesComponent } from './settings-user/certificates/certificates.component';
import { EmployeComponent } from './employe/employe.component';
import { MassiveDownloadComponent } from './massive-download/massive-download.component';

const routes: Routes = [
  {
    path: 'panel',
    component: MainComponent,
    children: [
      { path: 'welcome', component: WelcomeComponent },
      { path: 'xml-generate', component: CreateXmlComponent },
      { path: 'settings', component: SettingsUserComponent },
      { path: 'taxes', component: TaxesComponent },
      { path: 'receiver/:slug', component: ReceiversComponent },
      { path: 'certificate/:slug', component: CertificatesComponent },
      { path: 'employe', component: EmployeComponent },
      { path: 'massive-download', component: MassiveDownloadComponent },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkAreaRoutingModule { }
