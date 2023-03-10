import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  apiUrl: string = environment.apiUrl;
  userSlug: string | null = sessionStorage.getItem('slug');
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${sessionStorage.getItem('token')}`
    })
  };

  constructor(private httpClient: HttpClient) { }

  getXmlsData() {
    return this.httpClient.get(`${this.apiUrl}/xml_files/${this.userSlug}`, this.httpOptions)
  }

  getImagePdf(slugEmitter: string) {
    return this.httpClient.get(`${this.apiUrl}/pdf_image/${slugEmitter}`, this.httpOptions);
  }
}
