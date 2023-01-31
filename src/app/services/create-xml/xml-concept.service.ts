import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class XmlConceptService {

  apiUrl = environment.apiUrl;
  slugUser = environment.slugUser;

  constructor(private httpClient: HttpClient) { }

  getDataValidateConcept() { return { slugConcept: [''] } }

  getConcepts() {
    return this.httpClient.get(`${this.apiUrl}/create_xml/${this.slugUser}/show_concepts`);
  }

  getTaxes() {
    return this.httpClient.get(`${this.apiUrl}/create_xml/${this.slugUser}/show_taxes`)
  }
}

