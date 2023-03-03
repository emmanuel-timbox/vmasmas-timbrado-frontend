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

    insertDataMassive(massive: Massive) {
      return this.httpClient.post(`${this.apiUrl}/ `, massive, this.httpOptions);
    }
  
    getValidateKey(formData: FormData, slug: string) {
      return this.httpClient.post<any>(`${this.apiUrl}/create_xml/${slug}/validate_key`, formData, this.httpOptions);
    }
 
    getDataValidateMassive() {
      return {
  
        rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],
        rfc_receptor: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],
        correo:['', [Validators.required,  Validators.maxLength(50), Validators.pattern(this.nonWhitespaceRegExp)]],
        fechaIncial:['', [Validators.required,  Validators.maxLength(50), Validators.pattern(this.nonWhitespaceRegExp)]],
        fechafinal:['', [Validators.required,  Validators.maxLength(50), Validators.pattern(this.nonWhitespaceRegExp)]],
        complemento:[],
        tipo_so:[],
        rfc_acuentaAterceros:['', [Validators.nullValidator , Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],
        tipo_com:[],
        password:[],
        key:[],
        uuid:['', [Validators.nullValidator,  Validators.maxLength(50), Validators.pattern(this.nonWhitespaceRegExp)]],
        rfcR_uuid: ['', [Validators.nullValidator, Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],

     
      }
    }
  
  }
  