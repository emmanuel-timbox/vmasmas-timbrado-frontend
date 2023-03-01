import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ToastrModule} from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './views/auth/auth.module';
import { MainModule } from './views/work-area/main.module';
import { NotFountPageComponent } from './views/not-fount-page/not-fount-page.component';
import { AuthRoutingModule } from './views/auth/auth-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../app/interceptors/HttpErrorInterceptor';

@NgModule({
  declarations: [AppComponent, NotFountPageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    MainModule,
    HttpClientModule,
    ToastrModule.forRoot({  timeOut: 3000, positionClass: 'toast-top-right',preventDuplicates: true }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent], // solo aplica para componentes que lleven html
})

export class AppModule {
}

