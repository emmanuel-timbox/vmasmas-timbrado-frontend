
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CatalogsService {

  pathTaxRegimenCat: string = environment.pathTaxRegimenCat
  pathCatalogs: string = environment.pathCatalogs

  constructor(private httpClient: HttpClient) { }

  getTaxRegimenCat() {
    return this.httpClient.get(this.pathTaxRegimenCat);
  }

  getCurrenciesCat() {
    return this.httpClient.get(`${this.pathCatalogs}/cat_currencies.json`);
  }

  getCfdiUsagesCat() {
    return this.httpClient.get(`${this.pathCatalogs}/cat_cfdi_usages.json`);
  }

  getTaxesCat() {
    return this.httpClient.get(`${this.pathCatalogs}/cat_tax_rates.json`)
  }

  getTaxObjectCat() {
    return this.httpClient.get(`${this.pathCatalogs}/cat_tax_object.json`)
  }
}
