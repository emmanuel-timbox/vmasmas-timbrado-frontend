import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { XmlReceiverService } from 'src/app/services/create-xml/xml-receiver.service';

@Component({
  selector: 'app-xml-receiver',
  templateUrl: './xml-receiver.component.html',
  styleUrls: ['./xml-receiver.component.scss']
})

export class XmlReceiverComponent implements OnInit {

  constructor(private _catalogs: CatalogsService, private _services: XmlReceiverService,
    private formBuider: FormBuilder) { }

  @Output() emitterReceiver = new EventEmitter<any>();

  CfdiUsageCat!: any;
  receiversList: any;
  summitForm: Boolean = false;
  formReceiver: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.formReceiver = this.formBuider.group(this._services.getDataValidateReceiver());
    this.getCfdiUsagesCat;
  }

  get f(): { [key: string]: AbstractControl } { return this.formReceiver.controls; }

  registrerReceiveNode() {
    this.summitForm = true;
    this.emitterReceiver.emit({
      formReceiver: this.formReceiver.value,
      isInvalid: this.formReceiver.invalid
    });
    if (this.formReceiver.invalid) { return }
  }

  setDataReceiverForm(event: Event): void {
    let slug: string = (event.target as HTMLInputElement).value;
    let dataReceiver: any = this.receiversList.find((x: any) => x.slug == slug);

    this.formReceiver.setValue({
      bussinessName: dataReceiver.bussiness_name,
      rfc: dataReceiver.rfc,
      cfdiUse: dataReceiver.cfdi_use,
      taxDomicile: dataReceiver.receiving_tax_domicile,
      taxRegime: dataReceiver.recipient_tax_regimen,
      taxResidence: dataReceiver.tax_residence,
      fiscalIdNumber: dataReceiver.tax_residence
    });
  }

  getReceivers(slug: string): void {
    this._services.getReceivers(slug).subscribe({
      next: response => {
        this.receiversList = JSON.parse(JSON.stringify(response)).data;
      },
      error: error => { console.log(error) }
    });
  }

  private getCfdiUsagesCat(): void {
    this._catalogs.getCfdiUsagesCat().subscribe({
      next: response => {
        this.CfdiUsageCat = response
      },
      error: error => { console.log(error) }
    });
  }

}
