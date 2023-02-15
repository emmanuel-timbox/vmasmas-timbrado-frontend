import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Validators } from '@angular/forms';
import { Employe } from '../models/employe.model';


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
    return this.httpCliente.delete(`${this.apiUrl}/employe/${slugemployee}`)
  }

  editEmployee(emitter: Employe, slugemployee: string) {
    return this.httpCliente.put(`${this.apiUrl}/employe/${slugemployee}`, emitter)
  }

  getDataValidateEmployees() {
    return {

      rfc: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],
      curp: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(19), Validators.pattern(this.nonWhitespaceRegExp)]],
      social_security_number: ['', [Validators.minLength(11), Validators.maxLength(11)]],
      work_start_date:  [''],
      antiquity:['', [ Validators.minLength(5), Validators.maxLength(5)]],
      type_contract: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern(this.nonWhitespaceRegExp)]],
      unionized: ['',[ Validators.minLength(2), Validators.maxLength(2) ]],
      type_working_day: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern(this.nonWhitespaceRegExp)]],
      regime_type: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern(this.nonWhitespaceRegExp)]],
      employee_number: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern(this.nonWhitespaceRegExp)]],
      departament: ['',[ Validators.minLength(10), Validators.maxLength(100) ]],
      risk_put: ['',[ Validators.minLength(1), Validators.maxLength(2)]],
      put: ['',[ Validators.minLength(2), Validators.maxLength(20)]],
      payment_frequency: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern(this.nonWhitespaceRegExp)]],
      banck: ['',[ Validators.minLength(3), Validators.maxLength(3)]],
      banck_account: ['',[ Validators.minLength(18), Validators.maxLength(20)]],
      base_salary: ['',[ Validators.minLength(1), Validators.maxLength(5)]],
      daily_salary:['',[ Validators.minLength(1), Validators.maxLength(5)]],
      federative_entity_key:['',[ Validators.minLength(1), Validators.maxLength(5)]]


    }
  }



}
