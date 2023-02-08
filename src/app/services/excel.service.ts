import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ExecelService {

  apiUrl = environment.apiUrl;

  constructor(private httpCliente: HttpClient) { }

  getExcel(slug: string) {
    return this.httpCliente.get(`${this.apiUrl}/employe/${slug}`)
  }

  insertFile(formData: FormData) {
    return this.httpCliente.post(`${this.apiUrl}/employe`, formData)
  }


}
