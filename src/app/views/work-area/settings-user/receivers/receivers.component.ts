import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReceiverService } from '../../../../services/receiver.service';
import { environment } from '../../../../../environments/environment';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { SweetAlertsService } from '../../../../services/sweet-alert.service'
import { Subject } from 'rxjs';
import { Receiver } from 'src/app/models/receiver.model';

declare let bootstrap: any;

@Component({
  selector: 'app-receivers',
  templateUrl: './receivers.component.html',
  styleUrls: ['./receivers.component.scss']
})

export class ReceiversComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;


  files: File[] = [];
  dtOptions: DataTables.Settings = {};
  slug!: string | null;


  dtTrigger: Subject<any> = new Subject<any>();
  submittedCreate = false;
  submittedEdit = false;
  jsonDataTaxRegiment: any;
  dataReceivers: any;
  dataReceiversEdit: any;
  formNewReceiver: FormGroup = new FormGroup({});
  formEditReceiver: FormGroup = new FormGroup({});
  indexArrayReceiver!: number;
  slugReceiverUpdate!: string;
  selectedTaxRegime!: string;
  
  constructor(private route: ActivatedRoute, private _service: ReceiverService, private formBuilder: FormBuilder,
    private swal: SweetAlertsService) { }
  

  ngOnInit(): void {


    let tooltipAfter = [].slice.call(document.querySelectorAll('[class="tooltip bs-tooltip-auto fade show"]'));
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
   this.formNewReceiver = this.formBuilder.group(this._service.getDataValidateReceiver());
    this.formEditReceiver = this.formBuilder.group(this._service.getDataValidateReceiver());
    this.getDataReceivers();
    this.dtOptions = {
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      }
    }



    tooltipAfter.map(function (item) {
      const elem: HTMLElement = item;
      elem.remove()
    });

    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    this.slug = this.route.snapshot.paramMap.get('slug');
    
    this.dtOptions = {
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      },
    };
  }


  ngAfterViewChecked() { }

  get f(): { [key: string]: AbstractControl } { return this.formNewReceiver.controls; }

  get fEdit(): { [key: string]: AbstractControl } { return this.formEditReceiver.controls; }


  onSelect(event: { addedFiles: any; }) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }


  createReceiver(): void {

    this.submittedCreate = true;


    const receiver: Receiver = {

      bussinessName : this.formNewReceiver.value.bussinessName,
      rfc : this.formNewReceiver.value.rfc,
      cfdiUse : this.formNewReceiver.value.cfdiUse,
      receivingTaxDomicile : this.formNewReceiver.value.receivingTaxDomicile,
      recipientTaxRegimen : this.formNewReceiver.value.recipientTaxRegimen,
      taxIdNumber : this.formNewReceiver.value.taxIdNumber,
      tax_residence : this.formNewReceiver.value.tax_residence,
      slugUser: environment.slugUser
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

  showModalEditReceiver(dataReceiver: any, index: number): void {
    new bootstrap.Modal(this.editModal.nativeElement).show();
    this.indexArrayReceiver = index;
    this.slugReceiverUpdate = dataReceiver.slug;



    this.formEditReceiver.setValue({

      bussinessName : dataReceiver.bussiness_name,
      rfc : dataReceiver.rfc,
      cfdiUse : 1,
      receivingTaxDomicile : dataReceiver.receiving_tax_domicile,
      recipientTaxRegimen : dataReceiver.recipient_tax_regimen,
      taxIdNumber : dataReceiver.tax_id_number,
      tax_residence : dataReceiver.tax_residence,

    });
  }

  private createNewRow(newEmitter: any): void {
    this.dataReceivers.push({
      rfc: newEmitter.rfc,
      bussiness_name: newEmitter.bussiness_name,
      tax_regime: newEmitter.tax_regime,
      expedition_place: newEmitter.expedition_place,
      status: newEmitter.status,
      slug: newEmitter.slug
    });
  }
  resetFormCreate(): void {
    this.submittedCreate = false;
    this.formNewReceiver.reset();
  }

  private getDataReceivers() {
    this._service.getDataReceiver(environment.slugUser).subscribe({
      next: response => {
        this.dataReceivers = JSON.parse(JSON.stringify(response)).data;
        this.dtTrigger.next(null);
      },
      error: error => { console.log(error); }
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
   



    const receiver: Receiver = {

      bussinessName : this.formEditReceiver.value.bussinessName,
      rfc : this.formEditReceiver.value.rfc,
      cfdiUse : this.formEditReceiver.value.cfdiUse,
      receivingTaxDomicile : this.formEditReceiver.value.receivingTaxDomicile,
      recipientTaxRegimen : this.formEditReceiver.value.recipientTaxRegimen,
      taxIdNumber : this.formEditReceiver.value.taxIdNumber,
      tax_residence : this.formEditReceiver.value.tax_residence,
      slugUser: environment.slugUser
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


}
