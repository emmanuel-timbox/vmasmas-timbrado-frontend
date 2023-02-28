import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class XmlConceptService {

  apiUrl: string = environment.apiUrl;
  slugUser: string | null = sessionStorage.getItem('slug');
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${sessionStorage.getItem('token')}`
    })
  };


  constructor(private httpClient: HttpClient) { }

  getDataValidateConcept() { return { slugConcept: [''] } }

  getConcepts() {
    return this.httpClient.get(`${this.apiUrl}/create_xml/${this.slugUser}/show_concepts`, this.httpOptions);
  }

  getTaxes() {
    return this.httpClient.get(`${this.apiUrl}/create_xml/${this.slugUser}/show_taxes`, this.httpOptions)
  }
}

