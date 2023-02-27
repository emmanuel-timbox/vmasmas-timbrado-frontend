import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { SweetAlertsService } from './../../../services/sweet-alert.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-registrer',
  templateUrl: './registrer.component.html',
  styleUrls: ['./registrer.component.scss']
})

export class RegistrerComponent implements OnInit {

  formUser: FormGroup = new FormGroup({});
  submitted = false;

  constructor(private _service: AuthService, private swal: SweetAlertsService,
    private formBuild: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.formUser = this.formBuild.group(this._service.getDataValidateUser(), {
      validators: [this._service.match('password', 'confirmPassword')]
    })
  }

  get f(): { [key: string]: AbstractControl } { return this.formUser.controls; }

  registrerUser() {

    this.submitted = true;
    if (this.formUser.invalid) { return }

    const user: User = {
      rfc: this.formUser.value.rfc,
      name: this.formUser.value.name,
      email: this.formUser.value.email,
      password: this.formUser.value.password,
    };

    this._service.insertUser(user).subscribe({
      next: response => {
        const result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.swal.successAlert('Se registro de manera correcta el su informacio.');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.swal.infoAlert('¡Verifica!', result.message);
        }
      },
      error: error => { console.log(error); }
    })
  }


}
