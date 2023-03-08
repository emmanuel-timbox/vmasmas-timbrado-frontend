import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { Concept } from 'src/app/models/concept.model';
import { ConceptService } from '../../../../services/concept.service';
import { SweetAlertsService } from '../../../../services/sweet-alert.service';
import { DataTableDirective } from 'angular-datatables';

declare let bootstrap: any;

@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.component.html',
  styleUrls: ['./concepts.component.scss']
})
export class ConceptsComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @ViewChild('editModal') editModal!: ElementRef;

  slugUrl: string = '';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  submittedCreate = false;
  submittedEdit = false;
  dataConcepts: any;
  dataTaxObjectCat: any;
  dataConceptsEdit: any;
  indexArrayConcept!: number;
  slugConceptUpdate!: string;
  selectTaxObject!: string;
  formNewConcept: FormGroup = new FormGroup({});
  formEditConcept: FormGroup = new FormGroup({});

  constructor(private _el: ElementRef, private _service: ConceptService,
    private _catalogs: CatalogsService, private formBuilder: FormBuilder,
    private swal: SweetAlertsService) { }

  ngOnInit(): void {
    this.dtOptions = { language: { url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json' } };
    this.formNewConcept = this.formBuilder.group(this._service.getDataValidateConcept());
    this.formEditConcept = this.formBuilder.group(this._service.getDataValidateConcept());
    this.getDataConcepts();
    this.getTaxObjectCat();
  }

  ngAfterViewChecked() { }

  get f(): { [key: string]: AbstractControl } { return this.formNewConcept.controls; }

  get fEdit(): { [key: string]: AbstractControl } { return this.formEditConcept.controls }

  createConcept(): void {
    this.submittedCreate = true;

    if (this.formNewConcept.invalid) { return }

    const concept: Concept = {
      productKey: this.formNewConcept.value.productKey,
      idNumber: this.formNewConcept.value.idNumber,
      unitKey: this.formNewConcept.value.unitKey,
      unit: this.formNewConcept.value.unit,
      description: this.formNewConcept.value.description,
      taxObject: this.formNewConcept.value.taxObject,
      slugUser: `${sessionStorage.getItem('slug')}`
    };

    this._service.insertDataConcept(concept).subscribe({
      next: (response) => {
        let result = JSON.parse(JSON.stringify(response));
        let receiver = result.data;
        if (result.code == 200) {
          this.createNewRow(receiver);
          this.resetFormCreate();
          this.swal.successAlert('Los datos se guardaron de manera correcta');
          this.tableRerender();
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar los datos de manera correcta');
          this.resetFormCreate();
        }
      },
      error: (error) => { console.log(error); },
    });
  }

  editDataConcept(): void {
    this.submittedEdit = true;

    if (this.formEditConcept.invalid) { return }

    const concept: Concept = {
      productKey: this.formEditConcept.value.productKey,
      idNumber: this.formEditConcept.value.idNumber,
      unitKey: this.formEditConcept.value.unitKey,
      unit: this.formEditConcept.value.unit,
      description: this.formEditConcept.value.description,
      taxObject: this.formEditConcept.value.taxObject,
    };

    this._service.editConcept(concept, this.slugConceptUpdate).subscribe({
      next: (response) => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.dataConcepts[this.indexArrayConcept] = result.data;
          this.swal.successAlert('Los datos se actualizaron de manera correcta');
          this.tableRerender();
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar los datos');
        }
      },
      error: (error) => { console.log(error); },
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

  showModalEditReceiver(dataConcept: any, index: number): void {
    new bootstrap.Modal(this.editModal.nativeElement).show();
    this.indexArrayConcept = index;
    this.slugConceptUpdate = dataConcept.slug;
    this.selectTaxObject = dataConcept.tax_object;
    this.formEditConcept.setValue({
      description: dataConcept.description,
      taxObject: dataConcept.tax_object,
      idNumber: dataConcept.id_number,
      unit: dataConcept.unit,
      unitKey: dataConcept.unit_key,
      productKey: dataConcept.product_key,
    });
  }

  resetFormCreate(): void {
    this.submittedCreate = false;
    this.formNewConcept.reset();
  }

  private getDataConcepts(): void {
    this._service.getDataConcept().subscribe({
      next: (response) => {
        this.dataConcepts = JSON.parse(JSON.stringify(response)).data;
        this.dtTrigger.next(null);
      }, error: (error) => { console.log(error); },
    });
  }

  private getTaxObjectCat(): void {
    this._catalogs.getTaxObjectCat().subscribe({
      next: response => { this.dataTaxObjectCat = response; },
      error: error => { console.log(error); }
    });
  }

  private createNewRow(newConcept: any): void {
    this.dataConcepts.push({
      product_key: newConcept.product_key,
      id_number: newConcept.id_number,
      unit_key: newConcept.unit_key,
      unit: newConcept.unit,
      description: newConcept.description,
      status: newConcept.status,
      slug: newConcept.slug
    });
  }

  private tableRerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }

}
