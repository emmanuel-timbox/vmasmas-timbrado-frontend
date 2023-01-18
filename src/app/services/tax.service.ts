import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tax } from '../models/tax.model';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  apiUrl: string = environment.apiUrl;
  userSlug: string = environment.slugUser;
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'jwt-token'
    })
  };

  constructor(private httpClient: HttpClient) { }

  getDataValidateTax() {
    return { minimumValue: [''], maximumValue: [''] }
  }

  insertTax(tax: Tax) {
    return this.httpClient.post(`${environment.apiUrl}/tax_configs`, tax, this.httpOptions);
  }

  editStatusTax(slug: string) {
    return this.httpClient.delete(`${environment.apiUrl}/tax_configs/${slug}`)
  }

  getDataTaxes(slug: string) {
    return this.httpClient.get(`${environment.apiUrl}/tax_configs/${slug}`);
  }

}
