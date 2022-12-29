import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Emitter } from '../models/emitter.model';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TaxPeapleService {

  apiUrl: string = environment.apiUrl;
  pathTaxRegimenCat: string = environment.pathTaxRegimenCat
  userSlug: string = environment.slugUser;
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'jwt-token'
    })
  };

  constructor(private httpClient: HttpClient) { }

  getDataValidateEmitter() {
    return {
      bussinessName: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(this.nonWhitespaceRegExp)]],
      rfc: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],
      expeditionPlace: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(this.nonWhitespaceRegExp)]],
      taxRegime: ['', Validators.required]
    }
  }

  insertDataEmitter(emitter: Emitter) {
    return this.httpClient.post(`${this.apiUrl}/tax_data_configs`, emitter, this.httpOptions);
  }

  editStatusEmitter(slugEmitter: string) {
    return this.httpClient.delete(`${this.apiUrl}/tax_data_configs/${slugEmitter}`)
  }

  getTaxRegimenCat() {
    return this.httpClient.get(this.pathTaxRegimenCat);
  }

  getDataEmitter(slugUser: string) {
    return this.httpClient.get(`${this.apiUrl}/tax_data_configs/${slugUser}`)
  }

  editEmitter(emitter: Emitter, slugEmitter: string) { 
    return this.httpClient.put(`${this.apiUrl}/tax_data_configs/${slugEmitter}`, emitter)
  }

}
