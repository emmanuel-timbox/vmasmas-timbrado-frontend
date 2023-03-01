import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Validators } from '@angular/forms';
import { Massive } from '../models/massive.model';

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
  

    getEmitterData() {
      return this.httpClient.get(`${this.apiUrl}/emitter_configs/${this.userSlug}`, this.httpOptions);
    }
  
    insertFile(formData: FormData) {
      return this.httpClient.post(`${this.apiUrl}/massive`, formData, this.httpOptions)
    }

    getCertificate(slug: string) {
      return this.httpClient.get(`${this.apiUrl}/certificate/${slug}`)
    }
    getValidateKey(formData: FormData, slug: string) {
      return this.httpClient.post<any>(`${this.apiUrl}/create_xml/${slug}/validate_key`, formData, this.httpOptions);
    }
 
    getDataValidateMassive() {
      return {
  
        rfc: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],
        rfc_emisor: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],
        rfc_receptor: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],
        correo:[],
        fechaIncial:[],
        fechafinal:[],
        complemento:[],
        tipo_so:[],
        rfc_acuentaAterceros:[],
        tipo_com:[],
        password:[],
        key:[],
        uuid:[],
        rfcR_uuid: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],

     
      }
    }
  
  }
  