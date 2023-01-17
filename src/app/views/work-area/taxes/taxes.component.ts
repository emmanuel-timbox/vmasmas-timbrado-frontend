import { environment } from 'src/environments/environment';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TaxService } from './../../../services/tax.service';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { Tax } from './../../../models/tax.model';

declare var bootstrap: any;

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss'],
})

export class TaxesComponent implements OnInit {

  @ViewChild('editModal') editModal!: ElementRef;

  taxesCat!: any;
  isReadonly: boolean = true
  isValid: boolean = true;
  seletedOption: boolean = false;
  messageError!: string;
  dataTaxSelected: any = null;
  dtOptions: DataTables.Settings = {}; //tabal de impuestos
  formTax: FormGroup = new FormGroup({})

  constructor(private _services: TaxService, private _catalogs: CatalogsService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.dtOptions = {
      lengthMenu: [5, 10, 25, 50, 100],
      pageLength: 5,
      language: { url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json' },
    };

    this.formTax = this.formBuilder.group(this._services.getDataValidateTax());
    this.getTaxesCat();
  }

  setDataInputs(event: Event) {
    let keyValue: string = (event.target as HTMLInputElement).value;
    this.seletedOption = false

    if (keyValue != '') {
      let dataSearchTax = this.taxesCat.find((x: any) => x[0] == keyValue);
      let dataTax = dataSearchTax[1];
      this.formTax.setValue({ minimumValue: dataTax.val_min, maximumValue: dataTax.val_max });
      this.isReadonly = dataTax.name.includes('Rango') ? false : true;
      this.dataTaxSelected = dataTax;
      this.isValid = true;
    } else {
      this.isValid = false;
      this.resetForm();
      this.messageError = '*No ha seleccionado un valor de la lista de Impuestos.';
    }
  }

  registrerTax() {
    let formData = this.formTax.value;
    let tax: Tax;

    if (this.dataTaxSelected == null) {
      this.formTax.reset();
      this.isValid = false;
      this.messageError = '*No ha seleccionado un valor de la lista de Impuestos.';
      return;
    }

    if (this.dataTaxSelected.name.includes('Rango')) {
      let isInvalid = formData.minimumValue > formData.maximumValue ? true : false
      if (isInvalid) {
        this.isValid = false;
        this.messageError = "El de Tasa Impuesto no puede ser mayor a el Valor Maximo";
        return;
      }
      tax = {
        taxKey: this.dataTaxSelected.id,
        taxName: this.dataTaxSelected.name,
        taxRate: this.formTax.value.minimumValue,
        slugUser: environment.slugUser
      }
    } else {
      tax = {
        taxKey: this.dataTaxSelected.id,
        taxName: this.dataTaxSelected.name,
        taxRate: this.formTax.value.maximumValue,
        slugUser: environment.slugUser
      }
    }
    this.createTax(tax)
  }

  resetForm() {
    this.formTax.reset();
    this.seletedOption = true;
    this.dataTaxSelected = null;
  }

  private getTaxesCat(): void {
    this._catalogs.getTaxesCat().subscribe({
      next: response => { this.taxesCat = Object.entries(response); },
      error: error => { console.log(error); }
    })
  }

  private createTax(dataTax: any) {
    this._services.insertTax(dataTax).subscribe({
      next: response => {
        
      }, error: error => { console.log(error); }
    });
  }

}

