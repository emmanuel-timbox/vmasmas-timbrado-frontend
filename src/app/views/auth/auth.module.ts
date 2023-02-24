
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { RegistrerComponent } from './registrer/registrer.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { FragmentsTemplateModule } from '../fragments-template/fragments-template.module';

@NgModule({
  declarations: [
    RecoverPasswordComponent,
    UpdatePasswordComponent,
    LoginComponent,
    RegistrerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FragmentsTemplateModule
  ],
  exports: [
    RecoverPasswordComponent,
    UpdatePasswordComponent,
    LoginComponent,
    RegistrerComponent
  ],
})
export class AuthModule { }
