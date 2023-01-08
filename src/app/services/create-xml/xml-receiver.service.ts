import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class XmlReceiverService {

  apiUrl: string  = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getDataValidateReceiver() {
    return {
      serie: ['', [Validators.required]],
      invoice: ['', [Validators.required]],
      export: ['', [Validators.required]],
      coin: ['', [Validators.required]],
      voucherType: ['', [Validators.required]]
    }
  }

  getReceivers(slugEmitter: string) {
    return this.httpClient.get(`${this.apiUrl}/create_xml/${slugEmitter}/receivers_show`);
  }

}
