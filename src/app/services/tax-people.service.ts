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
  rfcFormatter: string = "[A-Z&amp;Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
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
      rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13), Validators.pattern(this.rfcFormatter)]],
      expeditionPlace: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(this.nonWhitespaceRegExp)]],
      taxRegime: ['', Validators.required]
    }
  }

  insertDataEmitter(emitter: Emitter) {
    return this.httpClient.post(`${this.apiUrl}/emitter_configs`, emitter, this.httpOptions);
  }

  editStatusEmitter(slugEmitter: string) {
    return this.httpClient.delete(`${this.apiUrl}/emitter_configs/${slugEmitter}`)
  }

  getTaxRegimenCat() {
    return this.httpClient.get(this.pathTaxRegimenCat);
  }

  getDataEmitter(slugUser: string) {
    return this.httpClient.get(`${this.apiUrl}/emitter_configs/${slugUser}`)
  }

  editEmitter(emitter: Emitter, slugEmitter: string) {
    return this.httpClient.put(`${this.apiUrl}/emitter_configs/${slugEmitter}`, emitter)
  }

}
