import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })

export class CertificateService {

  apiUrl = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `${sessionStorage.getItem('token')}`
    })
  };

  constructor(private httpCliente: HttpClient) { }

  getCertificate(slug: string) {
    return this.httpCliente.get(`${this.apiUrl}/certificate/${slug}`, this.httpOptions)
  }

  insertFile(formData: FormData) {
    return this.httpCliente.post(`${this.apiUrl}/certificate`, formData, this.httpOptions)
  }

  updateFile(formData: FormData, slug: string) {
    return this.httpCliente.put(`${this.apiUrl}/certificate/${slug}`, formData, this.httpOptions);
  }
}
