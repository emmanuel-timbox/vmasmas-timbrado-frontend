import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Tax } from './../../../models/tax.model';
import { TaxService } from './../../../services/tax.service';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { CatalogsService } from 'src/app/services/catalogs.service';

declare let bootstrap: any

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss'],
})

export class TaxesComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @ViewChild('editModal') editModal!: ElementRef;

  taxesCat!: any;
  isReadonly: boolean = true
  isValid: boolean = true;
  isValidEdit: boolean = true;
  seletedOption: boolean = false;
  messageError!: string;
  dataTaxSelected: any = null;
  editSlug!: string;
  editTaxName!: string;
  arrayIndexTax!: number;
  taxesData!: any;
  dtOptions: DataTables.Settings = {}; //tabal de impuestos
  dtTrigger: Subject<any> = new Subject<any>();
  formTax: FormGroup = new FormGroup({});
  formTaxEdit: FormGroup = new FormGroup({});

  constructor(private _services: TaxService, private _catalogs: CatalogsService,
    private formBuilder: FormBuilder, private swal: SweetAlertsService) { }

  ngOnInit(): void {

    this.dtOptions = {
      lengthMenu: [5, 10, 25, 50, 100],
      pageLength: 5,
      language: { url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json' },
      destroy: true
    };

    this.formTax = this.formBuilder.group(this._services.getDataValidateTax());
    this.formTaxEdit = this.formBuilder.group(this._services.getDataValidateTax());
    this.getTaxesCat();
    this.getTaxes();
  }

  setDataInputs(event: Event): void {
    let keyValue: string = (event.target as HTMLInputElement).value;
    this.seletedOption = false;

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
    let tax: Tax;

    if (this.dataTaxSelected == null) {
      this.formTax.reset();
      this.isValid = false;
      this.messageError = '*No ha seleccionado un valor de la lista de Impuestos.';
      return;
    }

    if (this.dataTaxSelected.name.includes('Rango')) {
      let validate = this.validateTaxes(this.formTax.value);

      if (!validate.isValid) {
        this.isValid = validate.isValid;
        this.messageError = validate.message;
        return;
      }

      tax = {
        taxKey: this.dataTaxSelected.id,
        taxName: this.dataTaxSelected.name,
        taxRate: this.formTax.value.minimumValue == 0.000000 ? (0.00).toFixed(6) :
          this.formTax.value.minimumValue.toFixed(6),
        slugUser: `${sessionStorage.getItem('slug')}`
      };

    } else {

      tax = {
        taxKey: this.dataTaxSelected.id,
        taxName: this.dataTaxSelected.name,
        taxRate: this.formTax.value.maximumValue,
        slugUser: `${sessionStorage.getItem('slug')}`
      };

    }

    this.createTax(tax);
  }

  editTax() {
    let validate = this.validateTaxes(this.formTaxEdit.value);
    let tax: Tax;

    if (!validate.isValid) {
      this.isValidEdit = validate.isValid;
      this.messageError = validate.message;
      return;
    }

    tax = {
      slugUser: `${sessionStorage.getItem('slug')}`,
      slugTax: this.editSlug,
      taxRate: this.formTaxEdit.value.minimumValue == 0.000000 ? (0.00).toFixed(6) :
        Number(this.formTaxEdit.value.minimumValue).toFixed(6),
      taxName: this.editTaxName
    };

    this._services.editTax(tax).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.taxesData[this.arrayIndexTax] = result.data;
          this.tableRerender();
        } else {
          this.swal.infoAlert('¡Verifica!', result.message)
        }
      },
      error: error => { console.log(error) }
    });

  }

  deleteTax(slugTax: string, index: number): void {
    let message = 'Se borrara el Impuesto seleccionado. ¡No prodra revertir esto!'
    this.swal.confirmationAlert(message).then((result: any) => {
      if (result.isConfirmed) {

        this._services.editStatusTax(slugTax).subscribe({
          next: response => {
            let result = JSON.parse(JSON.stringify(response));
            if (result.code == 200) {
              this.taxesData.splice(index, 1);
              this.tableRerender();
              this.swal.successAlert('El estatus se actualizo de manera correcta.');
            } else {
              this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar el estatus');
            }
          },
          error: error => { console.log(error); }
        });

      }
    });
  }

  resetForm(): void {
    this.formTax.reset();
    this.seletedOption = true;
    this.dataTaxSelected = null;
  }

  showModalEditTax(tax: any, index: number) {
    new bootstrap.Modal(this.editModal.nativeElement).show();
    let dataSearchTax = this.taxesCat.find((x: any) => x[1].name == tax.tax_name);
    this.editSlug = tax.slug;
    this.arrayIndexTax = index;
    this.editTaxName = dataSearchTax[1].name;
    this.formTaxEdit.setValue({
      minimumValue: tax.tax_rate,
      maximumValue: dataSearchTax[1].val_max
    });
  }

  private getTaxes(): void {
    this._services.getDataTaxes().subscribe({
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
        console.log(result)
        if (result.code == 200) {
          this.swal.successAlert('Los datos se guardaron de manera correcta');
          this.resetForm();
          this.createNeWRow(result.data);
          this.tableRerender();
        } else {
          this.swal.infoAlert('¡Verifica!', result.message);
        }
      }, error: error => { console.log(error); }
    });
  }

  private createNeWRow(newEmitter: any): void {
    this.taxesData.push({
      tax_key: newEmitter.tax_key,
      tax_name: newEmitter.tax_name,
      tax_rate: newEmitter.tax_rate,
      status: newEmitter.status,
      slug: newEmitter.slug
    });
  }

  private tableRerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }

  private validateTaxes(formTax: any): any {
    const regex = /^\d+(?:\.\d{1,6})?$/;
    let itsBiggerThat = formTax.minimumValue > formTax.maximumValue ? true : false;
    let stringNumber = String(formTax.minimumValue);

    if (stringNumber.match(regex) == null) {
      return {
        isValidE: false,
        message: 'La cantidad de decimales no debe ser mayor a 6 digitos.'
      };
    }

    if (itsBiggerThat) {
      return {
        isValid: false,
        message: 'El valor de Tasa Impuesto no puede ser mayor a el Valor Maximo.'
      };
    }

    return { isValid: true, message: null };
  }

}
