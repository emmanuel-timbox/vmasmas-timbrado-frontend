import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ExecelService {


  apiUrl = environment.apiUrl;
  pathTaxRegimenCat: string = environment.pathTaxRegimenCat
  userSlug: string = environment.slugUser;
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'jwt-token'
    })
  };

  constructor(private httpCliente: HttpClient) { }

  getdataEmployees() {
    return this.httpCliente.get(`${this.apiUrl}/employe/${this.userSlug}`)
  }

  insertFile(formData: FormData) {
    return this.httpCliente.post(`${this.apiUrl}/employe`, formData)
  }
  editStatusEmployee(slugemployee: string) {
    return this.httpCliente.delete(`${this.apiUrl}/emitter_configs/${slugemployee}`)
  }

  getDataValidateEmployees() {
    return {

      rfc: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],

    }
  }



}
