import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Emitter } from 'src/app/models/emitter.model';
import { TaxPeapleService } from '../../../services/tax-people.service';
import { SweetAlertsService } from '../../../services/sweet-alert.service'

declare let bootstrap: any

@Component({
  selector: 'app-settings-user',
  templateUrl: './settings-user.component.html',
  styleUrls: ['./settings-user.component.scss'],
})

export class SettingsUserComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  submittedCreate = false;
  submittedEdit = false;
  jsonDataTaxRegiment: any;
  dataEmitters: any;
  dataEmitterEdit: any;
  formNewEmitter: FormGroup = new FormGroup({});
  formEditEmitter: FormGroup = new FormGroup({});
  indexArrayEmitter!: number;
  slugEmitterUpdate!: string;
  selectedTaxRegime!: string;

  constructor(private _service: TaxPeapleService, private formBuilder: FormBuilder,
    private swal: SweetAlertsService) { }

  ngOnInit(): void {
    this.formNewEmitter = this.formBuilder.group(this._service.getDataValidateEmitter());
    this.formEditEmitter = this.formBuilder.group(this._service.getDataValidateEmitter());
    this.getTaxRegimenCat();
    this.getDataEmitters();
    this.dtOptions = {
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      }
    }
  }

  ngAfterViewInit(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get f(): { [key: string]: AbstractControl } { return this.formNewEmitter.controls; }

  get fEdit(): { [key: string]: AbstractControl } { return this.formEditEmitter.controls; }

  createTaxPeople(): void {
    this.submittedCreate = true;
    if (this.formNewEmitter.invalid) { return }

    const emmiter: Emitter = {
      bussinessName: this.formNewEmitter.value.bussinessName,
      rfc: this.formNewEmitter.value.rfc,
      expeditionPlace: this.formNewEmitter.value.expeditionPlace,
      taxRegime: this.formNewEmitter.value.taxRegime,
      address: this.formNewEmitter.value.address,
      slugUser: `${sessionStorage.getItem('slug')}`
    };

    this._service.insertDataEmitter(emmiter).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        let emitter = result.data;
        if (result.code == 200) {
          this.swal.successAlert('Los datos del Emisor se guardaron de manera correcta');
          this.resetFormCreate();
          this.createNewRow(emitter);
          this.tableRerender();
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo guardar los datos de manera correcta');
          this.resetFormCreate();
        }
      },
      error: error => { console.log(error) }
    });
  }

  editEstatusEmitter(slugEmitter: string, index: number): void {
    this._service.editStatusEmitter(slugEmitter).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response))
        if (result.code == 200) {
          this.dataEmitters[index] = result.data
          this.swal.successAlert('El estatus se actualizo de manera correcta');
          this.tableRerender();
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar el estatus');
        }
      },
      error: error => { console.log(error) }
    });
  }

  editDataEmiiter(): void {
    this.submittedEdit = true;
    if (this.formEditEmitter.invalid) { return }
    const emmiter: Emitter = {
      bussinessName: this.formEditEmitter.value.bussinessName,
      rfc: this.formEditEmitter.value.rfc,
      expeditionPlace: this.formEditEmitter.value.expeditionPlace,
      taxRegime: this.formEditEmitter.value.taxRegime,
      address:  this.formEditEmitter.value.address
    };

    this._service.editEmitter(emmiter, this.slugEmitterUpdate).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.dataEmitters[this.indexArrayEmitter] = result.data
          this.swal.successAlert('Los datos se actualizaron de manera correcta');
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar los datos');
        }
      },
      error: error => { console.log(error) }
    })
  }

  showModalEditEmitter(dataEmitter: any, index: number): void {
    new bootstrap.Modal(this.editModal.nativeElement).show();
    this.indexArrayEmitter = index;
    this.slugEmitterUpdate = dataEmitter.slug;
    this.selectedTaxRegime = dataEmitter.tax_regime
    this.formEditEmitter.setValue({
      bussinessName: dataEmitter.bussiness_name,
      rfc: dataEmitter.rfc,
      expeditionPlace: dataEmitter.expedition_place,
      taxRegime: dataEmitter.tax_regime,
      address: dataEmitter.address
    });
  }

  resetFormCreate(): void {
    this.submittedCreate = false;
    this.formNewEmitter.reset();
  }

  private getTaxRegimenCat(): any {
    this._service.getTaxRegimenCat().subscribe((response) => {
      this.jsonDataTaxRegiment = response;
    })
  }

  private getDataEmitters() {
    this._service.getDataEmitter().subscribe({
      next: response => {
        this.dataEmitters = JSON.parse(JSON.stringify(response)).data;
        this.dtTrigger.next(null);
      },
      error: error => { console.log(error); }
    });
  }

  private createNewRow(newEmitter: any): void {
    this.dataEmitters.push({
      rfc: newEmitter.rfc,
      bussiness_name: newEmitter.bussiness_name,
      tax_regime: newEmitter.tax_regime,
      expedition_place: newEmitter.expedition_place,
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

}
