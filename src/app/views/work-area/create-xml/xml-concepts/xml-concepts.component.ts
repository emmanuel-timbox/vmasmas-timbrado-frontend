import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { XmlConceptService } from './../../../../services/create-xml/xml-concept.service';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';


@Component({
  selector: 'app-xml-concepts',
  templateUrl: './xml-concepts.component.html',
  styleUrls: ['./xml-concepts.component.scss']
})

export class XmlConceptsComponent implements OnInit {

  dataConcepts!: any;
  itemsAccordion: any = []
  formAddConcept: FormGroup = new FormGroup({});

  formName!: FormGroup;

  constructor(private _service: XmlConceptService, private swal: SweetAlertsService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formAddConcept = this.formBuilder.group(this._service.getDataValidateConcept());

    this.formName = this.formBuilder.group({
      productKey: ['', [Validators.required]],// ClaveProdServ
      quantity: ['', Validators.required],// Cantidad
      unitKey: ['', Validators.required],// ClaveUnidad
      description: ['', [Validators.required]],// Descripcion
      unitValue: ['', [Validators.required]],// ValorUnitario
      amount: ['', [Validators.required]], //Importe
      taxObject: ['', Validators.required],// ObjetoImp
      idNumber: [''], //NoIdentificacion
      unit: [''],// Unidad
      discount: [''], //Descuento
      items: this.formBuilder.array([this.createItem()])
    });

    this.getConcepts();

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
    this.itemsAccordion.push(concept);
  }

  getControls() {
    return  (this.formName.get('items') as FormArray).controls
  }

  private createItem(): FormGroup {
    return this.formBuilder.group({
      productKey: '',
      quantity: '',
      unitKey: '',
      description: '',
      unitValue: '',
      amount: '',
      taxObject: '',
      idNumber: '',
      unit: '',
      discount: ''
    });
  }

}
