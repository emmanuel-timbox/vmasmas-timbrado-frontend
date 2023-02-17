import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  @Output() emitterConcept = new EventEmitter<any>();

  dataConcepts!: any;
  itemsAccordion: any = []
  formAddConcept: FormGroup = new FormGroup({});
  mainForm!: FormGroup;
  dataTaxes!: any;
  dataTaxObjectCat!: any;
  selectTaxObject!: string;
  total!: string;
  subtotal!: string;
  discount!: string;
  totalForTax!: any;
  resultData!: any;

  constructor(private _service: XmlConceptService, private _catalogs: CatalogsService,
    private swal: SweetAlertsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formAddConcept = this.formBuilder.group(this._service.getDataValidateConcept());
    this.mainForm = this.formBuilder.group({
      total: '', subtotal: '', discount: '',
      concepts: this.formBuilder.array([])
    });
    this.total = (0).toFixed(2);
    this.subtotal = (0).toFixed(2);
    this.discount = (0).toFixed(2);
    this.getConcepts();
    this.getTaxObjectCat();
    this.getTaxes();
  }

  regitrerConcept() {
    let existConcepts: number = this.mainForm.value.concepts.length;
    let isInvalid: boolean = existConcepts == 0 ? true : false;

    this.mainForm.get('total')?.setValue(this.total);
    this.mainForm.get('subtotal')?.setValue(this.subtotal);
    this.mainForm.get('discount')?.setValue(this.discount);
    this.emitterConcept.emit({ conceptForm: this.mainForm.value, isInvalid: isInvalid });
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

  get getControl() {
    return this.mainForm.get("concepts") as FormArray;
  }

  getControlTaxes(indexConceptForm: number): any {
    return this.getControl.at(indexConceptForm).get('taxForm') as FormArray;
  }

  addConceptAccordion() {
    let slugConcept: string = this.formAddConcept.value.slugConcept;
    let conceptBuild!: any;

    if (slugConcept != '') {
      let concept: any = this.dataConcepts.find((x: any) => x.slug == slugConcept);
      this.selectTaxObject = concept.tax_object;
      conceptBuild = this.formBuilder.group({
        productKey: [concept.product_key, [Validators.required]],// ClaveProdServ
        quantity: [1, Validators.required],// Cantidad
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
    const controlFormControl = this.getControlTaxes(index);
    const taxBuild = this.formBuilder.group({
      tax: '', base: '', typeFactor: '', nodeType: '', shareRate: '', amount: ''
    });
    controlFormControl.push(taxBuild);
  }

  setValuesFormTax(event: Event, indexFormTax: number, indexFormConcept: number) {
    let keyValue: string = (event.target as HTMLInputElement).value;
    let messageError: string;

    if (keyValue != '') {
      let tax: any = this.dataTaxes.find((x: any) => x.slug == keyValue);
      let base: number = this.getControl.at(indexFormConcept).get('amount')?.value;
      let typeFactor: string = tax.tax_name.includes('Tasa') ? 'Tasa' : 'Cuota';
      let nodeType: string = tax.tax_name.includes('Trasladado') ? 'Traslado' : 'Retencion'
      let value = {
        tax: tax.tax_key,
        base: base,
        typeFactor: typeFactor,
        nodeType: nodeType,
        shareRate: tax.tax_rate,
        amount: (base * Number(tax.tax_rate)).toFixed(4)
      };

      if (this.existTypeTax(indexFormConcept, value)) {
        messageError = 'Ya se encuntro registrado este Impuesto previamente'
        this.swal.infoAlert('Se repite registro', messageError)
        return;
      }

      this.getControlTaxes(indexFormConcept).at(indexFormTax).patchValue(value);
      this.calculteTotal();
    } else {
      messageError = 'Favor de seleccionar un valor valido.'
      this.swal.infoAlert('¡Verifica!', messageError);
      // this.getControlTaxes(indexFormConcept).at(indexFormTax).patchValue({
      //   tax: '', base: '', typeFactor: '', nodeType: '', shareRate: '', amount: ''
      // });
    }
  }

  deleteConcept(conceptIndex: number): void {
    let conceptForm = this.getControl.at(conceptIndex);
    let quantity: number = Number(conceptForm.get('quantity')?.value);
    let unitValue: number = Number(conceptForm.get('unitValue')?.value);
    let discount: number = Number(conceptForm.get('discount')?.value);
    let subtotal: number = Number(this.subtotal);
    let totalAmounts: number = 0;
    let amountConcept: number = Number(quantity * unitValue);

    this.getControl.removeAt(conceptIndex);
    this.subtotal = (subtotal - amountConcept).toFixed(2);
    this.discount = String((Number(this.discount) - discount).toFixed(2));

    conceptForm.value.taxForm.forEach((element: any) => { totalAmounts += Number(element.amount); });
    this.total = (Number(this.total) - ((amountConcept + totalAmounts) - discount)).toFixed(2);
  }

  deleteTaxForm(indexConceptForm: number) {
    let lengthTaxForm = this.getControlTaxes(indexConceptForm);
    let lostIndex: number = lengthTaxForm.value.length - 1;

    if (lengthTaxForm != 0) {
      this.getControlTaxes(indexConceptForm).removeAt(lostIndex);
    }
  }

  setAmount(index: number): void {
    let unitValue: number = this.getControl.value[index].unitValue;
    let quantity: number = this.getControl.value[index].quantity;
    let total: number = 0;

    this.getControl.at(index).get('amount')?.setValue(Number(unitValue * quantity).toFixed(2));
    this.setBaseAndImportTax(index);
    // se va calculando el subtotal
    this.getControl.controls.forEach(element => {
      let amount: number = Number(element.get('quantity')?.value) * Number(element.get('unitValue')?.value);
      total += amount;
    });

    this.subtotal = String((total).toFixed(2));
    this.calculteTotal();
  }

  calculateDiscont(index: number): void {
    let unitValue: number = this.getControl.value[index].unitValue;
    let quantity: number = this.getControl.value[index].quantity;
    let discount: number = this.getControl.value[index].discount;
    let total = Number((unitValue * quantity) - discount).toFixed(2);
    let totalDescount = 0;

    this.getControl.at(index).get('amount')?.setValue(total);
    this.setBaseAndImportTax(index);
    this.getControl.controls.forEach(element => {
      let discount = element.get('discount')?.value;
      totalDescount += Number(discount);
    });
    this.discount = String(totalDescount.toFixed(2));

    this.calculteTotal();
  }

  calculateAmountTaxForm(indexTaxForm: number, indexFormConcept: number) {
    let taxForm = this.getControlTaxes(indexFormConcept);
    let base: number = Number(taxForm.at(indexTaxForm).get('base').value);
    let shareRate: number = Number(taxForm.at(indexTaxForm).get('shareRate').value);

    taxForm.at(indexTaxForm).get('amount').setValue((base * shareRate).toFixed(2));
  }

  private calculteTotal() {
    let total: number = 0

    this.getControl.value.forEach((formConcept: any) => {
      let totalForTaxes: number = 0;
      formConcept.taxForm.forEach((element: any) => {
        totalForTaxes += Number(element.amount);
      });
      total += totalForTaxes;
    });

    this.total = (total + Number(this.subtotal) - Number(this.discount)).toFixed(2);
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

  private existTypeTax(indexConcept: number, newTax: any): boolean {
    let formTaxes = this.getControlTaxes(indexConcept).value;
    let exist: boolean = false;

    if (formTaxes.length == 1) return false;

    formTaxes.forEach((element: any) => {
      if (element.tax == newTax.tax && element.typeFactor == newTax.typeFactor &&
        element.nodeType == newTax.nodeType && element.shareRate == newTax.shareRate) {
        exist = true;
        return;
      }
    });
    return exist;
  }

  resetForm() {
    this.getControl.clear();
    this.mainForm.reset();
  }

}
