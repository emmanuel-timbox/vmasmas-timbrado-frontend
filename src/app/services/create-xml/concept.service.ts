import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConceptService {

  constructor(private httpClient: HttpClient) { }

  getConcepts() {
    return this.httpClient.get(``);
  }

}
