
import { NgModule } from '@angular/core';
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
import { AuthGuard } from './../../guards/auth.guard';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: 'panel',
    component: MainComponent,
    children: [
      { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
      { path: 'xml-generate', component: CreateXmlComponent, canActivate: [AuthGuard] },
      { path: 'settings', component: SettingsUserComponent, canActivate: [AuthGuard] },
      { path: 'taxes', component: TaxesComponent, canActivate: [AuthGuard] },
      { path: 'receiver/:slug', component: ReceiversComponent, canActivate: [AuthGuard] },
      { path: 'certificate/:slug', component: CertificatesComponent, canActivate: [AuthGuard] },
      { path: 'employe', component: EmployeComponent, canActivate: [AuthGuard] },
      { path: 'massive-download', component: MassiveDownloadComponent, canActivate: [AuthGuard] },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkAreaRoutingModule { }
