import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReceiverService } from '../../../../services/receiver.service';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { SweetAlertsService } from '../../../../services/sweet-alert.service'
import { Subject } from 'rxjs';
import { Receiver } from 'src/app/models/receiver.model';
import { CatalogsService } from 'src/app/services/catalogs.service';

declare let bootstrap: any;

@Component({
  selector: 'app-receivers',
  templateUrl: './receivers.component.html',
  styleUrls: ['./receivers.component.scss']
})

export class ReceiversComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;

  slugUrl: string = "";
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  submittedCreate = false;
  submittedEdit = false;
  jsonDataTaxRegiment: any;
  dataReceivers: any;
  dataReceiversEdit: any;
  indexArrayReceiver!: number;
  slugReceiverUpdate!: string;
  cfdiUsageCat!: any;
  taxRegimesCat!: any;
  selectedCfdiUse!: string;
  selectedTaxRegime!: string;
  formNewReceiver: FormGroup = new FormGroup({});
  formEditReceiver: FormGroup = new FormGroup({});

  constructor(private route: ActivatedRoute,
    private _service: ReceiverService, private _catalogs: CatalogsService,
    private formBuilder: FormBuilder, private swal: SweetAlertsService) { }

  ngOnInit(): void {
    let tooltipAfter = [].slice.call(document.querySelectorAll('[class="tooltip bs-tooltip-auto fade show"]'));
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

    tooltipAfter.map(function (item) {
      const elem: HTMLElement = item;
      elem.remove();
    });

    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    this.slugUrl = `${this.route.snapshot.paramMap.get('slug')}` ;
    this.formNewReceiver = this.formBuilder.group(this._service.getDataValidateReceiver());
    this.formEditReceiver = this.formBuilder.group(this._service.getDataValidateReceiver());
    this.dtOptions = {
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      }
    };

    this.getCfdiUsageCat();
    this.getDataReceivers();
    this.getTaxRegimeCat();
  }

  ngAfterViewChecked() { }

  get f(): { [key: string]: AbstractControl } { return this.formNewReceiver.controls; }

  get fEdit(): { [key: string]: AbstractControl } { return this.formEditReceiver.controls; }

  createReceiver(): void {

    this.submittedCreate = true;

    if (this.formNewReceiver.invalid) { return }

    const receiver: Receiver = {
      bussinessName: this.formNewReceiver.value.bussinessName,
      rfc: this.formNewReceiver.value.rfc,
      cfdiUse: this.formNewReceiver.value.cfdiUse,
      receivingTaxDomicile: this.formNewReceiver.value.receivingTaxDomicile,
      recipientTaxRegimen: this.formNewReceiver.value.recipientTaxRegimen,
      taxIdNumber: this.formNewReceiver.value.taxIdNumber,
      tax_residence: this.formNewReceiver.value.taxResidence,
      slugEmitter: this.slugUrl
    };

    this._service.insertDataReceiver(receiver).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        let receiver = result.data;
        if (result.code == 200) {
          this.swal.successAlert('Los datos del Receptor se guardaron de manera correcta');
          this.resetFormCreate();
          this.createNewRow(receiver);
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar los datos de manera correcta');
          this.resetFormCreate();
        }
      },
      error: error => { console.log(error) }
    });
  }

  editEstatusReceiver(slugEmitter: string, index: number): void {
    this._service.editStatusReceiver(slugEmitter).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response))
        if (result.code == 200) {
          this.dataReceivers[index] = result.data
          this.swal.successAlert('El estatus se actualizo de manera correcta');
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar el estatus');
        }
      },
      error: error => { console.log(error) }
    });
  }

  editDataReceiver(): void {
    this.submittedEdit = true;

    if (this.formEditReceiver.invalid) { return }

    const receiver: Receiver = {
      bussinessName: this.formEditReceiver.value.bussinessName,
      rfc: this.formEditReceiver.value.rfc,
      cfdiUse: this.formEditReceiver.value.cfdiUse,
      receivingTaxDomicile: this.formEditReceiver.value.receivingTaxDomicile,
      recipientTaxRegimen: this.formEditReceiver.value.recipientTaxRegimen,
      taxIdNumber: this.formEditReceiver.value.taxIdNumber,
      tax_residence: this.formEditReceiver.value.taxResidence
    };

    this._service.editReceiver(receiver, this.slugReceiverUpdate).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.dataReceivers[this.indexArrayReceiver] = result.data
          this.swal.successAlert('Los datos se actualizaron de manera correcta');
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar los datos');
        }
      },
      error: error => { console.log(error) }
    })
  }

  private getCfdiUsageCat() {
    this._catalogs.getCfdiUsagesCat().subscribe({
      next: response => { this.cfdiUsageCat = response },
      error: error => { console.log(error) }
    })
  }

  private getTaxRegimeCat() {
    this._catalogs.getTaxRegimenCat().subscribe({
      next: response => { this.taxRegimesCat = response },
      error: error => { console.log(error) }
    })
  }

  showModalEditReceiver(dataReceiver: any, index: number): void {
    new bootstrap.Modal(this.editModal.nativeElement).show();
    this.indexArrayReceiver = index;
    this.slugReceiverUpdate = dataReceiver.slug;
    this.selectedCfdiUse = dataReceiver.cfdi_use
    this.selectedTaxRegime = dataReceiver.recipient_tax_regimen
    this.formEditReceiver.setValue({
      bussinessName: dataReceiver.bussiness_name,
      rfc: dataReceiver.rfc,
      cfdiUse: dataReceiver.cfdi_use,
      receivingTaxDomicile: dataReceiver.receiving_tax_domicile,
      recipientTaxRegimen: dataReceiver.recipient_tax_regimen,
      taxIdNumber: dataReceiver.tax_id_number,
      taxResidence: dataReceiver.tax_residence,
    });
  }

  resetFormCreate(): void {
    this.submittedCreate = false;
    this.formNewReceiver.reset();
  }

  private getDataReceivers() {
    this._service.getDataReceiver(this.slugUrl).subscribe({
      next: response => {
        this.dataReceivers = JSON.parse(JSON.stringify(response)).data;
        this.dtTrigger.next(null);
      },
      error: error => { console.log(error); }
    });
  }

  private createNewRow(newReceiver: any): void {
    this.dataReceivers.push({
      rfc: newReceiver.rfc,
      bussiness_name: newReceiver.bussiness_name,
      cfdi_use: newReceiver.cfdi_use,
      recipient_tax_regimen: newReceiver.recipient_tax_regimen,
      receiving_tax_domicile: newReceiver.receiving_tax_domicile,
      status: newReceiver.status,
      slug: newReceiver.slug,
      tax_id_number: newReceiver.tax_id_number,
      tax_residence: newReceiver.tax_residence
    });
  }

}
