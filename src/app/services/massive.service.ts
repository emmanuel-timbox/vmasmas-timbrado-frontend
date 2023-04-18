import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class MassiveService {

  apiUrl = environment.apiUrl;
  pathTaxRegimenCat: string = environment.pathTaxRegimenCat
  userSlug: string | null = sessionStorage.getItem('slug')
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");

  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `${sessionStorage.getItem('token')}`
    })
  };

  constructor(private httpClient: HttpClient) { }

  getDataValidateMassive() {
    return {
      rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(14)]],
      rfcSolicitante: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(14)]],
      rfcReceptor: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14)]],
      correo: ['', [Validators.required, Validators.email]],
      fechaInicial: ['', [Validators.required]],
      fechaFinal: ['', [Validators.required]],
      tipoSolicitud: ['', Validators.required],
      complemento: [''],
      rfcACuentaTerceros: [''],
      tipoComprobante: [''],
      estadoComprobante: [''],
      password: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(this.nonWhitespaceRegExp)]],
      // uuid: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(this.nonWhitespaceRegExp)]],
      // rfcUuid: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],
    }
  }

  getEmitterData() {
    return this.httpClient.get(`${this.apiUrl}/emitter_configs/${this.userSlug}`, this.httpOptions);
  }

  getMassiveData() {
    return this.httpClient.get(`${this.apiUrl}/massive/${this.userSlug}`, this.httpOptions);
  }

  getMassivePackages(idResquestSat: string) {
    return this.httpClient.get(`${this.apiUrl}/massive/${idResquestSat}/show_packages`, this.httpOptions);
  }

  insertDataMassive(formData: FormData) {
    return this.httpClient.post(`${this.apiUrl}/massive`, formData, this.httpOptions);
  }

  getValidateKey(formData: FormData, slug: string) {
    return this.httpClient.post<any>(`${this.apiUrl}/create_xml/${slug}/validate_key`, formData, this.httpOptions);
  }

}
