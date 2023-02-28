import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SweetAlertsService } from './../services/sweet-alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private swal: SweetAlertsService) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = sessionStorage.getItem('token');
    if (token == null) {
      this.swal.alertLoader('No tiene una session abierta.')
      setTimeout(() => {
        this.swal.closeAlert()
        this.router.navigate(['/login']);
      }, 2000);
      return false;
    }
    return true;
  }

}
