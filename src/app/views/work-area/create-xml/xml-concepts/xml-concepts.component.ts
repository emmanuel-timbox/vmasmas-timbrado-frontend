import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,  Validators, FormArray } from '@angular/forms';
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

  mainForm!: FormGroup;

  constructor(private _service: XmlConceptService, private swal: SweetAlertsService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formAddConcept = this.formBuilder.group(this._service.getDataValidateConcept());

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



}
