import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { CreateXmlComponent } from './xmls/create-xml/create-xml.component';
import { SettingsUserComponent } from './settings-user/settings-user.component';
import { TaxesComponent } from './taxes/taxes.component';
import { ReceiversComponent } from './settings-user/receivers/receivers.component';
import { CertificatesComponent } from './settings-user/certificates/certificates.component';
import { EmployeeComponent } from './employee/employee.component';
import { MassiveDownloadComponent } from './massive-download/massive-download.component';
import { AuthGuard } from './../../guards/auth.guard';
import { MainComponent } from './main.component';
import { SessionGuard } from './../../guards/session.guard';
import { CompanyImageComponent } from './company-image/company-image.component';

const routes: Routes = [
  {
    path: 'panel',
    component: MainComponent,
    children: [
      { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard, SessionGuard] },
      { path: 'xml-generate', component: CreateXmlComponent, canActivate: [AuthGuard, SessionGuard] },
      { path: 'settings', component: SettingsUserComponent, canActivate: [AuthGuard, SessionGuard] },
      { path: 'taxes', component: TaxesComponent, canActivate: [AuthGuard, SessionGuard] },
      { path: 'receiver/:slug', component: ReceiversComponent, canActivate: [AuthGuard, SessionGuard] },
      { path: 'certificate/:slug', component: CertificatesComponent, canActivate: [AuthGuard, SessionGuard] },
      { path: 'employe', component: EmployeeComponent, canActivate: [AuthGuard, SessionGuard] },
      { path: 'massive-download', component: MassiveDownloadComponent, canActivate: [AuthGuard, SessionGuard] },
      { path: 'image-pdf', component: CompanyImageComponent, canActivate: [AuthGuard, SessionGuard] }
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkAreaRoutingModule { }
