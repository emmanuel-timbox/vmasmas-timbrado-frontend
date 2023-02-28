
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

  constructor(private router: Router, private swal: SweetAlertsService,
    private jwtHelper: JwtHelperService) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = `${sessionStorage.getItem('token')}`
    // this.expirationCounter(token)
    return true;
  }

  // expirationCounter(token: string) {
  //   if (token != null) {
  //     const timeOut = this.jwtHelper.getTokenExpirationDate(token).valueOf() - new Date().valueOf();
  //     this.tokenSubscription.unsubscribe();
  //     this.tokenSubscription = of(null).pipe(delay(timeOut)).subscribe((expired) => {
  //       console.log('EXPIRED!!');
  //       this.swal.alertLoader('La sesio ya caduco.')
  //       setTimeout(() => {
  //         this.swal.closeAlert();
  //         this.router.navigate(['/login'])
  //       }, 200)

  //     });
  //   }

  // }

}
