
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CatalogsService {
  
  pathTaxRegimenCat: string = environment.pathTaxRegimenCat

  constructor(private httpClient: HttpClient) { }

  getTaxRegimenCat() {
    return this.httpClient.get(this.pathTaxRegimenCat);
  }


}
