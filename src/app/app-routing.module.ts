// import { RegistrerComponent } from './views/auth/registrer/registrer.component';
// import { LoginComponent } from './views/auth/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFountPageComponent } from './views/not-fount-page/not-fount-page.component';
import { AuthRoutingModule } from './views/auth/auth-routing.module';
import { WorkAreaRoutingModule } from './views/work-area/work-area-routing.module';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFountPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    WorkAreaRoutingModule,
    AuthRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
