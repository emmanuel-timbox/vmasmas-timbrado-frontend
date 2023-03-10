import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class XmlCertificateService {

  apiUrl: string = environment.apiUrl;
  userSlug: string | null = sessionStorage.getItem('slug');
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `${sessionStorage.getItem('token')}`
    })
  };

  constructor(private httpClient: HttpClient) { }

  getDataValidateCerticate() {
    return {
      bussinessName: [''],
      rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13), Validators.pattern(this.nonWhitespaceRegExp)]],
      expeditionPlace: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(this.nonWhitespaceRegExp)]],
      taxRegime: ['', [Validators.required]],
      certNumber: ['', [Validators.required]],
      passwordKey: ['', [Validators.required]],
      address: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
    };
  }

  getEmitterData() {
    return this.httpClient.get(`${this.apiUrl}/create_xml/${this.userSlug}`, this.httpOptions);
  }

  getValidateKey(formData: FormData, slug: string) {
    return this.httpClient.post<any>(`${this.apiUrl}/create_xml/${slug}/validate_key`, formData, this.httpOptions);
  }

}
