import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class XmlVaucherService {

  nonWhitespaceRegExp: RegExp = new RegExp("\\S");

  constructor() { }

  getDataValidateReceiver() {
    return {
      serie: [''],
      invoice: [''],
      payMethod: [''],
      wayToPay: [''],
      exchangeRate: [''],
      export: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      coin: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      voucherType: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]]
    };
  }
}
