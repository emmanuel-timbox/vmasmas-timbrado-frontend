import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tax } from '../models/tax.model';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  apiUrl: string = environment.apiUrl;
  userSlug: string | null = sessionStorage.getItem('slug');
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${sessionStorage.getItem('token')}`
    })
  };

  constructor(private httpClient: HttpClient) { }

  getDataValidateTax() {
    return { minimumValue: [''], maximumValue: [''] }
  }

  insertTax(tax: Tax) {
    return this.httpClient.post(`${this.apiUrl}/tax_configs`, tax, this.httpOptions);
  }

  editStatusTax(slug: string) {
    return this.httpClient.delete(`${this.apiUrl}/tax_configs/${slug}`, this.httpOptions);
  }

  editTax(tax: Tax) {
    return this.httpClient.put(`${this.apiUrl}/tax_configs/${tax.slugTax}`, tax, this.httpOptions);
  }

  getDataTaxes() {
    return this.httpClient.get(`${this.apiUrl}/tax_configs/${this.userSlug}`, this.httpOptions);
  }

}
