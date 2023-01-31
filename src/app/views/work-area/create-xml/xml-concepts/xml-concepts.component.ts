import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { XmlConceptService } from './../../../../services/create-xml/xml-concept.service';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { CatalogsService } from 'src/app/services/catalogs.service';

@Component({
  selector: 'app-xml-concepts',
  templateUrl: './xml-concepts.component.html',
  styleUrls: ['./xml-concepts.component.scss']
})

export class XmlConceptsComponent implements OnInit {

  dataConcepts!: any;
  itemsAccordion: any = []
  formAddConcept: FormGroup = new FormGroup({});
  mainForm!: FormGroup;
  dataTaxes!: any;
  dataTaxObjectCat!: any;
  selectTaxObject!: string;

  constructor(private _service: XmlConceptService, private _catalogs: CatalogsService,
    private swal: SweetAlertsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formAddConcept = this.formBuilder.group(this._service.getDataValidateConcept());
    this.mainForm = this.formBuilder.group({ concepts: this.formBuilder.array([]) });

    this.getConcepts();
    this.getTaxObjectCat();
    this.getTaxes();
  }

  getConcepts(): void {
    this._service.getConcepts().subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        this.dataConcepts = result.data;
      },
      error: error => { console.log(error); }
    });
  }

  addConceptAccordion() {
    let slugConcept: string = this.formAddConcept.value.slugConcept;
    let concept = this.dataConcepts.find((x: any) => x.slug == slugConcept);
    this.selectTaxObject = concept.tax_object
    const conceptBuild = this.formBuilder.group({
      productKey: [concept.product_key, [Validators.required]],// ClaveProdServ
      quantity: [0, Validators.required],// Cantidad
      unitKey: [concept.unit_key, Validators.required],// ClaveUnidad
      description: [concept.description, [Validators.required]],// Descripcion
      unitValue: [Number(0.00).toFixed(2), [Validators.required]],// ValorUnitario
      taxObject: [concept.tax_object, Validators.required],// ObjetoImp
      idNumber: [concept.id_number], //NoIdentificacion
      unit: [concept.unit],// Unidad
      discount: [''], //Descuento
      amount: Number(0.00).toFixed(2), //Importe
      taxForm: this.formBuilder.array([])
    });

    this.getControl.push(conceptBuild);
  }

  addTaxTable(index: number) {
    const controlFormControl = (this.getControl.at(index).get('taxForm') as FormArray)
    const taxBuild = this.formBuilder.group({
      tax: '',
      base: '',
      typeFactor: '',
      shareRate: ''
    });

    console.log(controlFormControl.push(taxBuild))
  }

  get getControl() {
    return this.mainForm.get("concepts") as FormArray;
  }

  getControlTaxes(index: number): any {
    return this.getControl.at(index).get('taxForm') as FormArray;
  }

  deleteLesson(lessonIndex: number): void {
    this.getControl.removeAt(lessonIndex);
  }

  setAmount(index: number): void {
    let unitValue: number = this.getControl.value[index].unitValue;
    let quantity: number = this.getControl.value[index].quantity;
    this.getControl.at(index).get('amount')?.setValue(Number(unitValue * quantity).toFixed(2));
  }

  calculateDiscont(index: number): void {
    let unitValue: number = this.getControl.value[index].unitValue;
    let quantity: number = this.getControl.value[index].quantity;
    let discount: number = this.getControl.value[index].discount;
    let total = Number((unitValue * quantity) - discount).toFixed(2);
    this.getControl.at(index).get('amount')?.setValue(total);
  }

  private getTaxObjectCat(): void {
    this._catalogs.getTaxObjectCat().subscribe({
      next: response => { this.dataTaxObjectCat = response; },
      error: error => { console.log(error); }
    });
  }

  private getTaxes(): void {
    this._service.getTaxes().subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        this.dataTaxes = result.data;
      },
      error: error => { console.log(error) }
    })
  }

}
