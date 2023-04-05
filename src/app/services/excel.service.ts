import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})

export class ExecelService {

  apiUrl = environment.apiUrl;
  pathTaxRegimenCat: string = environment.pathTaxRegimenCat
  userSlug: string | null = sessionStorage.getItem('slug');
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  rfcFormatter: string = "[A-Z&amp;Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]";
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `${sessionStorage.getItem('token')}`
    })
  };

  constructor(private httpCliente: HttpClient) { }

  getDataValidateEmployees() {
    return {
      bussiness_name: ['', [Validators.required, Validators.maxLength(99), Validators.pattern(this.nonWhitespaceRegExp)]],
      rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13), Validators.pattern(this.rfcFormatter)]],
      cfdi_use: ['', [Validators.required]],
      receiving_tax_domicile: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(this.nonWhitespaceRegExp)]],
      recipient_tax_regimen: ['', [Validators.required,]],
      curp: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      type_contract: ['', [Validators.required,]],
      regime_type: ['', [Validators.required,]],
      employee_number: ['', [Validators.required,]],
      payment_frequency: ['', [Validators.required,]],
      federative_entity_key: ['', [Validators.required,]],
      slug_receiver: [''],
      social_security_number: [''],
      work_start_date: [''],
      antiquity: [''],
      unionized: [''],
      type_working_day: [''],
      departament: [''],
      job: [''],
      occupational_risk: [''],
      banck: [''],
      banck_account: [''],
      base_salary: [''],
      daily_salary: [''],
      slug_employee: [''],
      id: [''],
      status: ['']
    };
  }

  getdataEmployees() {
    return this.httpCliente.get(`${this.apiUrl}/employee/${this.userSlug}`, this.httpOptions);
  }

  insertFile(formData: FormData) {
    return this.httpCliente.post(`${this.apiUrl}/employee`, formData, this.httpOptions);
  }

  editStatusEmployee(slugemployee: string) {
    return this.httpCliente.delete(`${this.apiUrl}/employee/${slugemployee}`, this.httpOptions);
  }

  editEmployee(emitter: Employee, slugemployee: string) {
    return this.httpCliente.put(`${this.apiUrl}/employee/${slugemployee}`, emitter, this.httpOptions);
  }

  donwloadLayout() {
    return this.httpCliente.get(`${environment.urlLayoutExcel}`, { responseType: 'blob' })
  }

}
