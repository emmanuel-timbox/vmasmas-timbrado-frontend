import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class XmlReceiverService {

  apiUrl: string = environment.apiUrl;
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");

  constructor(private httpClient: HttpClient) { }

  getDataValidateReceiver() {
    return {
      bussinessName: [''],
      rfc: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      cfdiUse: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      taxDomicile: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      taxRegime: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      taxResidence: [''],
      fiscalIdNumber: ['']
    }
  }

  getReceivers(slugEmitter: string) {
    return this.httpClient.get(`${this.apiUrl}/create_xml/${slugEmitter}/show_receivers`);
  }

}
