import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class XmlPreviewService {

  apiUrl: string = environment.apiUrl;
  userSlug: string | null = sessionStorage.getItem('slug');
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `${sessionStorage.getItem('token')}}`
    })
  };

  constructor(private httpClient: HttpClient) { }

  insertXml(xmlData: FormData) {
    return this.httpClient.post(`${this.apiUrl}/create_xml`, xmlData, this.httpOptions);
  }

  getImagesPdf(slugEmitter: string) {
    return this.httpClient.get(`${this.apiUrl}/pdf_image/${slugEmitter}`, this.httpOptions);
  }
}
