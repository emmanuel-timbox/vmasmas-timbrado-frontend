import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { XmlCertificateService } from 'src/app/services/create-xml/xml-certificate.service';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-xml-certificate',
  templateUrl: './xml-certificate.component.html',
  styleUrls: ['./xml-certificate.component.scss']
})

export class XmlCertificateComponent implements OnInit {

  @Output() dataFormResult = new EventEmitter<any>()

  files: File[] = [];
  emitterData: any;
  haveCerticate!: Boolean;
  summitFormCert: Boolean = false
  formCertificate: FormGroup = new FormGroup({});

  constructor(private _services: XmlCertificateService,
    private _catologs_services: CatalogsService, 
    private sweetAlets: SweetAlertsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.haveCerticate = true;
    this.formCertificate = this.formBuilder.group(this._services.getDataValidateCerticate())
    this.getEmitters();
  }

  get f(): { [key: string]: AbstractControl } { return this.formCertificate.controls; }

  getEmitters(): any {
    this._services.getEmitterData().subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.emitterData = result.data;
        } else {
          this.sweetAlets.infoAlert('¡Verifica!', 'No se encuentra registrados Emisores');
        }
      },
      error: error => { console.log(error) }
    });
  }

  setDataEmitterInput(event: Event): void {
    let dataEmitter!: any
    let slug: string = (event.target as HTMLInputElement).value;

    if (slug == '') { this.formCertificate.reset(); }

    dataEmitter = this.emitterData.find((x: any) => x.slug == slug);

    if (dataEmitter.certificate_number != null) {
      this.haveCerticate = true;
      this.formCertificate.setValue({
        bussinessName: dataEmitter.bussiness_name,
        rfc: dataEmitter.rfc,
        expeditionPlace: dataEmitter.expedition_place,
        taxRegime: dataEmitter.tax_regime,
        certNumber: dataEmitter.certificate_number == null ? '' : dataEmitter.certificate_number,
        passwordKey: ''
      });
    } else {
      this.haveCerticate = false;
      this.formCertificate.reset();
    }

    this.dataFormResult.emit(this.formCertificate.value)
  }

  getListTaxRegimes(): void {
    this._catologs_services.getTaxRegimenCat().subscribe({ 
      next: response => { 
        console.log(response)
      },
      error: error => { console.log(error)}
    });
  }

  onSelect(event: { addedFiles: any }) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

}
