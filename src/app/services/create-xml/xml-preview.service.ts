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

  constructor(private http: HttpClient) { }

  insertXml(xmlData: FormData) {
    return this.http.post(`${this.apiUrl}/create_xml`, xmlData, this.httpOptions);
  }
}
