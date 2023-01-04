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
//  pathTaxRegimenCat: string = environment.pathTaxRegimenCat
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
      bussinessName: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      cfdiUse : ['G01'],
      receivingTaxDomicile : ['', [Validators.required]],
      recipientTaxRegimen : ['', [Validators.required]],
      taxIdNumber : ['', [Validators.required]],
      tax_residence : ['', [Validators.required]],
      // expeditionPlace: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(this.nonWhitespaceRegExp)]],
      // taxRegime: ['', Validators.required]
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
