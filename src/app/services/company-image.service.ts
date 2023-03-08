import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyImageService {

  apiUrl: string = environment.apiUrl;
  userSlug: string | null = sessionStorage.getItem('slug');
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `${sessionStorage.getItem('token')}`
    })
  };

  constructor(private httpClient: HttpClient) { }

  getEmitter(){
    return this.httpClient.get(`${this.apiUrl}/emitter_configs/${this.userSlug}`,this.httpOptions)
  }

  getImages(emitterSlug: string){
    return this.httpClient.get(`${this.apiUrl}/pdf_image/${emitterSlug}`, this.httpOptions);
  }

  saveImages(formData: FormData) {
    return this.httpClient.post(`${this.apiUrl}/pdf_image`, formData, this.httpOptions);
  }

  updateImages(formData: FormData, slugEmitter: string){
    return this.httpClient.put(`${this.apiUrl}/pdf_image/${slugEmitter}`, formData, this.httpOptions);
  }

}
