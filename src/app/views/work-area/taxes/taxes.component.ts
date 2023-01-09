import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { ActivatedRoute } from '@angular/router';
import { ConceptService } from '../../../services/concept.service';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { SweetAlertsService } from '../../../services/sweet-alert.service';
import { Subject } from 'rxjs';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { Concept } from 'src/app/models/concept.model';

declare var bootstrap: any;

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss'],
})
export class TaxesComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;


  declare example1Data: Array<Select2OptionData>;
  declare example2Data: Array<Select2OptionData>;
  declare selectOptions: Options;
  dt1Options: DataTables.Settings = {}; //tabal de impuestos
  dt2Options: DataTables.Settings = {}; // tabla de conceptos

  slugUrl: string = '';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  submittedCreate = false;
  submittedEdit = false;
  jsonDataTaxRegiment: any;
  dataConcepts: any;
  dataConceptsEdit: any;
  indexArrayConcept!: number;
  slugConceptUpdate!: string;
  cfdiUsageCat!: any;
  taxRegimesCat!: any;
  selectedCfdiUse!: string;
  selectedTaxRegime!: string;
  formNewConcept: FormGroup = new FormGroup({});
  formEditConcept: FormGroup = new FormGroup({});

  constructor(
    private _el: ElementRef,
    private route: ActivatedRoute,
    private _service: ConceptService,
    private _catalogs: CatalogsService,
    private formBuilder: FormBuilder,
    private swal: SweetAlertsService
  ) {}

  ngOnInit(): void {
    this.dt1Options = {
      lengthMenu: [5, 10, 25, 50, 100],
      pageLength: 5,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
      },
    };

    this.dt2Options = {
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
      },
    };

    //inicializa los tooltips
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    let dataExampleSelect2 = [
      {
        id: 'basic1',
        text: 'Basic 1',
      },
      {
        id: 'basic2',
        text: 'Basic 2',
      },
      {
        id: 'basic3',
        text: 'Basic 3',
      },
      {
        id: 'basic4',
        text: 'Basic 4',
      },
    ];

    this.example1Data = dataExampleSelect2;
    this.example2Data = dataExampleSelect2;

    this.selectOptions = {
      dropdownParent: $('#modal-nuevo-receptor'),
    };

    this.slugUrl = `${this.route.snapshot.paramMap.get('slug')}`;
    this.formNewConcept = this.formBuilder.group(
      this._service.getDataValidateConcept()
    );
    this.formEditConcept = this.formBuilder.group(
      this._service.getDataValidateConcept()
    );
    this.getDataConcepts();
  }
  ngAfterViewChecked() {}

  get f(): { [key: string]: AbstractControl } {
    return this.formNewConcept.controls;
  }

  get fEdit(): { [key: string]: AbstractControl } {
    return this.formEditConcept.controls;
  }

  createConcept(): void {


    this.submittedCreate = true;

    const concept: Concept = {
      productKey: this.formNewConcept.value.productKey,
      idNumber: this.formNewConcept.value.idNumber,
      unitKey: this.formNewConcept.value.unitKey,
      unit: this.formNewConcept.value.unit,
      description: this.formNewConcept.value.description,
      taxObject: this.formNewConcept.value.taxObject,
      slugConcept: this.slugUrl
    };

    this._service.insertDataConcept(concept).subscribe({
      next: (response) => {
        let result = JSON.parse(JSON.stringify(response));
        let receiver = result.data;
        if (result.code == 200) {
          this.swal.successAlert(
            'Los datos se guardaron de manera correcta'
          );
          this.resetFormCreate();
          this.createNewRow(receiver);
        } else {
          this.swal.infoAlert(
            '¡Verifica!',
            'No se pudo actualizar los datos de manera correcta'
          );
          this.resetFormCreate();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  showModalEditReceiver(dataConcept: any, index: number): void {
    new bootstrap.Modal(this.editModal.nativeElement).show();
    this.indexArrayConcept = index;
    this.slugConceptUpdate = dataConcept.slug;
    this.selectedCfdiUse = dataConcept.cfdi_use
    this.selectedTaxRegime = dataConcept.recipient_tax_regimen
  
    this.formEditConcept.setValue({

      userId:'',
      description: dataConcept.description,
      taxObject: dataConcept.tax_object,
      idNumber: dataConcept.id_number,
      unit: dataConcept.unit,
      unitKey: dataConcept.unit_key,
      productKey: dataConcept.product_key,
    });
  }

  editEstatusConcept(slugConcept: string, index: number): void {
    this._service.editStatusConcept(slugConcept).subscribe({
      next: (response) => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.dataConcepts[index] = result.data;
          this.swal.successAlert('El estatus se actualizo de manera correcta');
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar el estatus');
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  editDataConcept(): void {
    this.submittedEdit = true;


    const concept: Concept = {
      productKey: this.formEditConcept.value.productKey,
      idNumber: this.formEditConcept.value.idNumber,
      unitKey: this.formEditConcept.value.unitKey,
      unit: this.formEditConcept.value.unit,
      description: this.formEditConcept.value.description,
      taxObject: this.formEditConcept.value.taxObject,
      slugConcept: this.formEditConcept.value.slugConcept,
    };

    this._service.editConcept(concept, this.slugConceptUpdate).subscribe({
      next: (response) => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          console.log(result.data);
          this.dataConcepts[this.indexArrayConcept] = result.data;
          this.swal.successAlert(
            'Los datos se actualizaron de manera correcta'
          );
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar los datos');
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  resetFormCreate(): void {
    this.submittedCreate = false;
    this.formNewConcept.reset();
  }

  private getDataConcepts() {
    this._service.getDataConcept('user-WFWSBBZOEXFS').subscribe({
      next: (response) => {

        this.dataConcepts = JSON.parse(JSON.stringify(response)).data;
        this.dtTrigger.next(null);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private createNewRow(newReceiver: any): void {
    this.dataConcepts.push({
      rfc: newReceiver.rfc,
      bussiness_name: newReceiver.bussiness_name,
      cfdi_use: newReceiver.cfdi_use,
      recipient_tax_regimen: newReceiver.recipient_tax_regimen,
      receiving_tax_domicile: newReceiver.receiving_tax_domicile,
      status: newReceiver.status,
      slug: newReceiver.slug,
      tax_id_number: newReceiver.tax_id_number,
      tax_residence: newReceiver.tax_residence,
    });
  }
}
