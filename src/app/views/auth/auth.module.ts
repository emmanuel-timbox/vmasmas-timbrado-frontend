
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { RegistrerComponent } from './registrer/registrer.component';
import { LoginComponent } from './login/login.component';
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
    FragmentsTemplateModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    RecoverPasswordComponent,
    UpdatePasswordComponent,
    LoginComponent,
    RegistrerComponent
  ],
})
export class AuthModule { }
