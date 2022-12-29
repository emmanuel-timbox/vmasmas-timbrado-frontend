import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Emitter } from 'src/app/models/emitter.model';
import { TaxPeapleService } from '../../../services/tax-people.service';
import { environment } from '../../../../environments/environment';
import { AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SweetAlertsService } from '../../../services/sweet-alert.service'
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

declare let bootstrap: any

@Component({
  selector: 'app-settings-user',
  templateUrl: './settings-user.component.html',
  styleUrls: ['./settings-user.component.scss'],
})

export class SettingsUserComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;

  dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  submittedCreate = false;
  submittedEdit = false;
  jsonDataTaxRegiment: any;
  dataEmitters: any;
  dataEmitterEdit: any;
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  formNewEmitter: FormGroup = new FormGroup({});
  formEditEmitter: FormGroup = new FormGroup({});

  constructor(private _service: TaxPeapleService, private formBuilder: FormBuilder,
    private swal: SweetAlertsService) { }

  ngOnInit(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    this.formNewEmitter = this.formBuilder.group(this._service.getDataValidateEmitter());
    this.formEditEmitter = this.formBuilder.group(this._service.getDataValidateEmitter());
    this.getTaxRegimenCat();
    this.getDataEmitters();
    this.dataEmitterEdit = {};
    this.dtOptions = {
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      }
    }
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
      slugUser: environment.slugUser
    };

    this._service.insertDataEmitter(emmiter).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        let emitter = result.data;
        if (result.code == 200) {
          this.swal.successAlert('Los datos del Emisor se guardaron de manera correcta');
          this.resetFormCreate();
          this.createNewRow(emitter)
        } else {
          this.swal.infoAlert('¡Verifica!', result.message);
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
        this.dataEmitters[index] = result.data
      },
      error: error => { console.log(error) }
    });
  }

  editDataEmiiter(): void{ 
    
    this.submittedEdit = true;

    if (this.formEditEmitter.invalid) { return }
  
   console.log(this.formEditEmitter)
    
    // const emitter: Emitter = { 
    //   bussinessName: this.formEditEmitter.value
    // }
    // this._service.editEmitter()
  }

  resetFormCreate(): void {
    this.submittedCreate = false;
    this.formNewEmitter.reset();
  }

  showModalEditEmitter(dataEmitter: any): void {
    new bootstrap.Modal(this.editModal.nativeElement).show();
    this.dataEmitterEdit = dataEmitter;
  }

  private getTaxRegimenCat(): any {
    this._service.getTaxRegimenCat().subscribe((response) => {
      this.jsonDataTaxRegiment = response;
    })
  }

  private getDataEmitters() {
    this._service.getDataEmitter(environment.slugUser).subscribe({
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
      slug: newEmitter.status
    });
  }

}
