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
  total!: string;
  subtotal!: string;

  constructor(private _service: XmlConceptService, private _catalogs: CatalogsService,
    private swal: SweetAlertsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formAddConcept = this.formBuilder.group(this._service.getDataValidateConcept());
    this.mainForm = this.formBuilder.group({ concepts: this.formBuilder.array([]) });
    this.total = (0).toFixed(2);
    this.subtotal = (0).toFixed(2);

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
    let conceptBuild!: any;

    if (slugConcept != '') {
      let concept: any = this.dataConcepts.find((x: any) => x.slug == slugConcept);
      this.selectTaxObject = concept.tax_object
      conceptBuild = this.formBuilder.group({
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
    } else {
      conceptBuild = this.formBuilder.group({
        productKey: ['', [Validators.required]],// ClaveProdServ
        quantity: [0, Validators.required],// Cantidad
        unitKey: ['', Validators.required],// ClaveUnidad
        description: ['', [Validators.required]],// Descripcion
        unitValue: [Number(0.00).toFixed(2), [Validators.required]],// ValorUnitario
        taxObject: ['', Validators.required],// ObjetoImp
        idNumber: [''], //NoIdentificacion
        unit: [''],// Unidad
        discount: [Number(0.00).toFixed(2)], //Descuento
        amount: Number(0.00).toFixed(2), //Importe
        taxForm: this.formBuilder.array([])
      });
    }

    this.getControl.push(conceptBuild);
  }

  addTaxTable(index: number) {
    const controlFormControl = this.getControlTaxes(index)
    const taxBuild = this.formBuilder.group({
      tax: '', base: '', typeFactor: '', shareRate: '', amount: ''
    });
    controlFormControl.push(taxBuild);
  }

  setValuesFormTax(event: Event, indexFormTax: number, indexFormConcept: number) {
    let keyValue: string = (event.target as HTMLInputElement).value

    if (keyValue != '') {
      let tax: any = this.dataTaxes.find((x: any) => x.slug == keyValue);
      let base: number = this.getControl.at(indexFormConcept).get('amount')?.value;
      let typeFactor: string = tax.tax_name.includes('Tasa') ? "Tasa" : "Cuota"

      this.getControlTaxes(indexFormConcept).at(indexFormTax).patchValue({
        tax: tax.tax_key,
        base: base,
        typeFactor: typeFactor,
        shareRate: tax.tax_rate,
        amount: (base * Number(tax.tax_rate)).toFixed(4)
      });
    } else {
      this.getControlTaxes(indexFormConcept).at(indexFormTax).patchValue({
        tax: '', base: '', typeFactor: '', shareRate: '', amount: ''
      });
    }
  }

  deleteConcept(conceptIndex: number): void {
    let conceptForm = this.getControl.at(conceptIndex);
    let quantity = conceptForm.get('quantity')?.value;
    let unitValue = conceptForm.get('unitValue')?.value;
    let subtotal = this.subtotal;
    this.getControl.removeAt(conceptIndex);
    this.subtotal = (Number(subtotal) - (Number(quantity) * Number(unitValue))).toFixed(2);
  }

  deleteTaxForm(indexConceptForm: number) {
    let lengthTaxForm = this.getControlTaxes(indexConceptForm);
    let lostIndex: number = lengthTaxForm.value.length - 1
    if (lengthTaxForm != 0) {
      this.getControlTaxes(indexConceptForm).removeAt(lostIndex);
    }
  }

  setAmount(index: number): void {
    let unitValue: number = this.getControl.value[index].unitValue;
    let quantity: number = this.getControl.value[index].quantity;
    this.getControl.at(index).get('amount')?.setValue(Number(unitValue * quantity).toFixed(2));
    this.setBaseAndImportTax(index);
    let total: number = 0
    this.getControl.controls.forEach(element => {
      let amount: number = Number(element.get('quantity')?.value) * Number(element.get('unitValue')?.value);
      total += amount;
    });

    this.subtotal = String((total).toFixed(2));
  }

  calculateDiscont(index: number): void {
    let unitValue: number = this.getControl.value[index].unitValue;
    let quantity: number = this.getControl.value[index].quantity;
    let discount: number = this.getControl.value[index].discount;
    let total = Number((unitValue * quantity) - discount).toFixed(2);
    this.getControl.at(index).get('amount')?.setValue(total);
    this.setBaseAndImportTax(index);
  }

  calculateAmountTaxForm(indexTaxForm: number, indexFormConcept: number) {
    let taxForm = this.getControlTaxes(indexFormConcept);
    let base: number = Number(taxForm.at(indexTaxForm).get('base').value);
    let shareRate: number = Number(taxForm.at(indexTaxForm).get('shareRate').value);
    taxForm.at(indexTaxForm).get('amount').setValue((base * shareRate).toFixed(2));
  }

  get getControl() {
    return this.mainForm.get("concepts") as FormArray;
  }

  getControlTaxes(indexConceptForm: number): any {
    return this.getControl.at(indexConceptForm).get('taxForm') as FormArray;
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
        let result: any = JSON.parse(JSON.stringify(response));
        this.dataTaxes = result.data;
      },
      error: error => { console.log(error) }
    })
  }

  private setBaseAndImportTax(index: number) {
    if (this.getControlTaxes(index).value.length != 0) {
      let amount = this.getControl.at(index).get("amount")?.value;
      let taxesForm = this.getControlTaxes(index);

      taxesForm.controls.forEach((element: any) => {
        element.get('base').setValue(amount);
        let base = element.get('base').value;
        let shareRate = element.get('shareRate').value;
        if (shareRate != '') element.get('amount').setValue((Number(base) * Number(shareRate)).toFixed(2));
      });
    }
  }

}
