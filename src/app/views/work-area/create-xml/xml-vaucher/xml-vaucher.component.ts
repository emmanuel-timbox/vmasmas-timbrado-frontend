import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { XmlReceiverService } from 'src/app/services/create-xml/xml-receiver.service';

@Component({
  selector: 'app-xml-vaucher',
  templateUrl: './xml-vaucher.component.html',
  styleUrls: ['./xml-vaucher.component.scss']
})
export class XmlVaucherComponent implements OnInit {

  formReceiver: FormGroup = new FormGroup({});

  constructor(private _services: XmlReceiverService,private _catalogs: CatalogsService, private formBuilder: FormBuilder) { }

  currentCatalog!: any

  ngOnInit(): void {
    this.getCurrentCatalog();
    this.formReceiver = this.formBuilder.group(this._services.getDataValidateReceiver());
  }

  private getCurrentCatalog(): void {
    this._catalogs.getCurrenciesCat().subscribe({ 
      next: response => { 
        this.currentCatalog = response
      },
      error: error => { console.log(error)}
    })
  }

}
