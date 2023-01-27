import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class XmlCertificateService {

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

  getDataValidateCerticate() {
    return {
      bussinessName: [''],
      rfc: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],
      expeditionPlace: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(this.nonWhitespaceRegExp)]],
      taxRegime: ['', [Validators.required]],
      certNumber: ['', [Validators.required]],
      passwordKey: ['', [Validators.required]]
    }
  }

  getEmitterData() {
    return this.httpClient.get(`${this.apiUrl}/create_xml/${this.userSlug}`);
  }

}
