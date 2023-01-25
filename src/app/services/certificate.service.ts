import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Certificate } from '../models/certificate.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  apiUrl = environment.apiUrl;

  constructor(private httpCliente: HttpClient) { }

  getCertificate(slug: string) {
    return this.httpCliente.get(`${this.apiUrl}/certificate/${slug}`)
  }

  insertFile(formData: FormData) {
    return this.httpCliente.post(`${this.apiUrl}/certificate`, formData)
  }

  updateFile(formData: FormData, slug: string) {
    return this.httpCliente.put(`${this.apiUrl}/certificate/${slug}`, formData);
  }
}
