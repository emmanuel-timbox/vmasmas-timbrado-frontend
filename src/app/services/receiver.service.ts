import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Receiver } from '../models/receiver.model';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReceiverService {

  apiUrl: string = environment.apiUrl;
  userSlug: string | null = sessionStorage.getItem('slug');
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  rfcFormatter: string = "[A-Z&amp;Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]"
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${sessionStorage.getItem('token')}`
    })
  };

  constructor(private httpClient: HttpClient) { }

  getDataValidateReceiver() {
    return {
      bussinessName: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13), Validators.pattern(this.rfcFormatter)]],
      cfdiUse: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      receivingTaxDomicile: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(this.nonWhitespaceRegExp)]],
      recipientTaxRegimen: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      taxIdNumber: ['', [Validators.pattern(this.nonWhitespaceRegExp)]],
      taxResidence: ['', [Validators.pattern(this.nonWhitespaceRegExp)]]
    }
  }

  insertDataReceiver(receiver: Receiver) {
    return this.httpClient.post(`${this.apiUrl}/receiver_configs`, receiver, this.httpOptions);
  }

  editStatusReceiver(slugReceiver: string) {
    return this.httpClient.delete(`${this.apiUrl}/receiver_configs/${slugReceiver}`, this.httpOptions)
  }

  getDataReceiver(slugUser: string) {
    return this.httpClient.get(`${this.apiUrl}/receiver_configs/${slugUser}`, this.httpOptions)
  }

  editReceiver(receiver: Receiver, slugReceiver: string) {
    return this.httpClient.put(`${this.apiUrl}/receiver_configs/${slugReceiver}`, receiver, this.httpOptions)
  }

}
