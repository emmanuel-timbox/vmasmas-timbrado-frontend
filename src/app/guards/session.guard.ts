
import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { delay, Observable, of, Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SweetAlertsService } from './../services/sweet-alert.service';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {

  tokenSubscription = new Subscription()

  constructor(private router: Router, private swal: SweetAlertsService) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = sessionStorage.getItem('token') as string
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);
    if (isExpired) {
      this.swal.alertLoader('Su sesion ya a terminado');
      setTimeout(() => {
        this.swal.closeAlert();
        this.router.navigate(['/login'])
      }, 2000);
      return false;
    }
    return true;
  }

}
