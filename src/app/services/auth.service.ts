import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './../models/user.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  apiUrl = environment.apiUrl;
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  rfcFormatter: string = "[A-Z&amp;Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"

  constructor(private httpClient: HttpClient) { }

  getDataValidateUser() {
    return {
      rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13), Validators.pattern(this.rfcFormatter)]],
      name: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(this.nonWhitespaceRegExp)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.nonWhitespaceRegExp)]],
      password: ['', Validators.required, Validators.minLength(8), Validators.maxLength(45)],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(45)]]
    }
  }

  insertUser(user: User) {
    return this.httpClient.post(`${this.apiUrl}/authenticate`, user);
  }

  login(user: User) {
    return this.httpClient.post(`${this.apiUrl}/`, user);
  }

  logout() {
    return this.httpClient.get(`${this.apiUrl}/logout`);
  }

  match(controlName: string, checkControlName: string): ValidatorFn {

    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };

  }

}
