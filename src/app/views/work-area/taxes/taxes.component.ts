import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { Tax } from './../../../models/tax.model';
import { TaxService } from './../../../services/tax.service';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { environment } from 'src/environments/environment';

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
  dtTrigger: Subject<any> = new Subject<any>();
  formTax: FormGroup = new FormGroup({});
  taxesData!: any;

  constructor(private _services: TaxService, private _catalogs: CatalogsService,
    private formBuilder: FormBuilder, private swal: SweetAlertsService) { }

  ngOnInit(): void {

    this.dtOptions = {
      lengthMenu: [5, 10, 25, 50, 100],
      pageLength: 5,
      language: { url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json' },
    };

    this.formTax = this.formBuilder.group(this._services.getDataValidateTax());
    this.getTaxesCat();
    this.getTaxes();
  }

  setDataInputs(event: Event): void {
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

  registrerTax(): void {
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

    this.createTax(tax);
  }

  editTaxEstatus(slugTax: string, index: number): void {
    this._services.editStatusTax(slugTax).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
      },
      error: error => { console.log(error); }
    })
  }

  resetForm(): void {
    this.formTax.reset();
    this.seletedOption = true;
    this.dataTaxSelected = null;
  }

  private getTaxes(): void {
    this._services.getDataTaxes(environment.slugUser).subscribe({
      next: respose => {
        this.taxesData = JSON.parse(JSON.stringify(respose)).data;
        this.dtTrigger.next(null);
      },
      error: error => { console.log(error); }
    });
  }

  private getTaxesCat(): void {
    this._catalogs.getTaxesCat().subscribe({
      next: response => { this.taxesCat = Object.entries(response); },
      error: error => { console.log(error); }
    });
  }

  private createTax(dataTax: any): void {
    this._services.insertTax(dataTax).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));

        if (result.code == 200) {
          this.swal.successAlert('Los datos se guardaron de manera correcta');
          this.resetForm();
          this.createNeWRow(result.data);
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo guardar los datos de menara correcta')
        }

      }, error: error => { console.log(error); }
    });
  }

  private createNeWRow(newEmitter: any): void {
    this.taxesData.push({
      tax_key: newEmitter.tax_key,
      tax_name: newEmitter.tax_name,
      tax_rate: newEmitter.tax_rate,
      slug: newEmitter.slug
    });
  }

}
