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
  userSlug: string = environment.slugUser;
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'jwt-token'
    })
  };

  constructor(private httpClient: HttpClient) { }

  getDataValidateReceiver() {
    return {
      bussinessName: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      rfc: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      cfdiUse: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      receivingTaxDomicile: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      recipientTaxRegimen: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      taxIdNumber: ['', [Validators.pattern(this.nonWhitespaceRegExp)]],
      taxResidence: ['', [Validators.pattern(this.nonWhitespaceRegExp)]]
    }
  }

  insertDataReceiver(receiver: Receiver) {
    return this.httpClient.post(`${this.apiUrl}/receiver_configs`, receiver, this.httpOptions);
  }

  editStatusReceiver(slugReceiver: string) {
    return this.httpClient.delete(`${this.apiUrl}/receiver_configs/${slugReceiver}`)
  }

  getDataReceiver(slugUser: string) {
    return this.httpClient.get(`${this.apiUrl}/receiver_configs/${slugUser}`)
  }

  editReceiver(receiver: Receiver, slugReceiver: string) {
    return this.httpClient.put(`${this.apiUrl}/receiver_configs/${slugReceiver}`, receiver)
  }

}
