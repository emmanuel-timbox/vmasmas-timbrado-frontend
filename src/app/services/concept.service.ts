import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Concept } from '../models/concept.model';


@Injectable({
  providedIn: 'root'
})
export class ConceptService {

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

  getDataValidateConcept() {
    return {
      productKey: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      idNumber: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      unitKey: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      unit: [''],
      description: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
      taxObject: ['', [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]],
    }
  }

  insertDataConcept(concept: Concept) {
    return this.httpClient.post(`${this.apiUrl}/concept_configs`, concept, this.httpOptions);
  }

  editStatusConcept(slugConcept: string) {
    return this.httpClient.delete(`${this.apiUrl}/concept_configs/${slugConcept}`)
  }

  getDataConcept(slugUser: string) {
    return this.httpClient.get(`${this.apiUrl}/concept_configs/${slugUser}`)
  }

  editConcept(concept: Concept, slugConcept: string) {
    return this.httpClient.put(`${this.apiUrl}/concept_configs/${slugConcept}`, concept)
  }

}
