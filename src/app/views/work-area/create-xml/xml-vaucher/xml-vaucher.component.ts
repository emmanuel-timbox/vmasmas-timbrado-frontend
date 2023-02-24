import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { XmlVaucherService } from './../../../../services/create-xml/xml-vaucher.service';

@Component({
  selector: 'app-xml-vaucher',
  templateUrl: './xml-vaucher.component.html',
  styleUrls: ['./xml-vaucher.component.scss']
})
export class XmlVaucherComponent implements OnInit {
  @Output() emitterVaucher = new EventEmitter<any>();

  currentCatalog!: any;
  payMethodCatalog!: any;
  formVaucher: FormGroup = new FormGroup({});
  summitForm: boolean = false;
  hideExchangeRateInput: boolean = true;

  constructor(private _services: XmlVaucherService, private _catalogs: CatalogsService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getPayMethods();
    this.getCurrentCatalog();
    this.formVaucher = this.formBuilder.group(this._services.getDataValidateReceiver());
  }

  get f(): { [key: string]: AbstractControl } { return this.formVaucher.controls; }

  registerFormVaucher() {
    this.summitForm = true;
    this.emitterVaucher.emit({
      formVaucher: this.formVaucher.value,
      isInvalid: this.formVaucher.invalid
    });

    if (this.formVaucher.invalid) { return }
  }

  showExchangeRate(event: Event): void {
    let coin: string = (event.target as HTMLInputElement).value;
    if (coin == 'MXN') {
      this.hideExchangeRateInput = true;
      this.formVaucher.get('exchangeRate')?.setValue('')
    }
    if (coin != 'MXN') this.hideExchangeRateInput = false;
  }

  resetForm() { this.formVaucher.reset() }

  private getPayMethods() {
    this._catalogs.getPayMethodsCat().subscribe({
      next: response => { this.payMethodCatalog = response },
      error: error => { console.log(error) }
    });
  }

  private getCurrentCatalog(): void {
    this._catalogs.getCurrenciesCat().subscribe({
      next: response => { this.currentCatalog = response },
      error: error => { console.log(error) }
    })
  }

}
