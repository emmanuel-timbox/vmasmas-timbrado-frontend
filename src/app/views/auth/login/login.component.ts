import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { SweetAlertsService } from './../../../services/sweet-alert.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../services/auth.service';
import { timeout } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup = new FormGroup({});
  submitted: boolean = false;
  notAccess:boolean = false;

  constructor(private _service: AuthService, private swal: SweetAlertsService,
    private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group(this._service.getDataValidateLogin());

  }

  get f(): { [key: string]: AbstractControl } { return this.formLogin.controls; }

  login(): void {
    this.submitted = true;
    if (this.formLogin.invalid) { return; }

    const user: User = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password
    };

    this._service.login(user).subscribe({
      next: response => {
        const result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.swal.alertLoader("Bienvenido");
          setTimeout(() => {
            this.swal.closeAlert();
            this.router.navigate(['/panel/welcome']);
          }, 2000);
        } else {
          this.notAccess = true;
        }
      },
      error: error => { console.log(error); }
    });
  }

}
