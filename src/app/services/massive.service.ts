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
    userSlug: string = environment.slugUser;
    nonWhitespaceRegExp: RegExp = new RegExp("\\S");
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'jwt-token'
      })
    };
  
    constructor(private httpCliente: HttpClient) { }
  

  
    insertFile(formData: FormData) {
      return this.httpCliente.post(`${this.apiUrl}/massive`, formData)
    }
 

  
    getDataValidateMassive() {
      return {
  
        rfc: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(14), Validators.pattern(this.nonWhitespaceRegExp)]],
     
      }
    }
  
  
  
  }
  