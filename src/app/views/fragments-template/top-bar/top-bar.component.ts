import { SweetAlertsService } from './../../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../services/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  constructor(private _service: AuthService, private routes: Router,
    private swal: SweetAlertsService) { }

  ngOnInit(): void {
  }

  logout() {
    this.swal.alertLoader()
    setTimeout(() => {
      this._service.logout();
      this.swal.closeAlert();
      this.routes.navigate(['/login'])
    }, 2000)
  }

}
