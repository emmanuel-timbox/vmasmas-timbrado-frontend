
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { FragmentsTemplateModule } from '../fragments-template/fragments-template.module';

@NgModule({
  declarations: [

    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FragmentsTemplateModule
  ],
  exports: [
    LoginComponent,
  ],
})
export class AuthModule { }
