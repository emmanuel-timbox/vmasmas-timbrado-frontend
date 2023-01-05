import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class XmlReceiverService {

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

}
