import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgWizardConfig, NgWizardService, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { MassiveService } from 'src/app/services/massive.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule } from '@angular/forms';


@Component({
  selector: 'app-massive-download',
  templateUrl: './massive-download.component.html',
  styleUrls: ['./massive-download.component.scss']
})
export class MassiveDownloadComponent implements OnInit {
  @Output() emitterSlugEmitter = new EventEmitter<string>();

  files: File[] = [];
  emitterData: any;
  haveCerticate!: Boolean;
  summitFormCert = false;
  formDescarga: FormGroup = new FormGroup({});
  slugEmitter!: string;
  fileIsInvalid!: boolean;
  disableFileInput: boolean = true;


  constructor(private _services: MassiveService, private _sweetAlets: SweetAlertsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getEmitterData()
    this.formDescarga = this.formBuilder.group(this._services.getDataValidateMassive());
  }


  get f(): { [key: string]: AbstractControl } { return this.formDescarga.controls; }

  getEmitterData(): any {
    this._services.getEmitterData().subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.emitterData = result.data;
        } else {
          this._sweetAlets.infoAlert('¡Verifica!', 'No se encuentra registrados Emisores');
        }
      },
      error: error => { console.log(error) }
    });
  }

  setDataEmitterInput(event: Event): void {
    let dataEmitter!: any
    let slug: string = (event.target as HTMLInputElement).value;

    if (slug == '') {
      this.formDescarga.reset();
      this.disableFileInput = true;
      this.files = []
      return;
    }

    dataEmitter = this.emitterData.find((x: any) => x.slug == slug);
    if (dataEmitter.certificate_number != null) {
      this.haveCerticate = true;
      this.slugEmitter = slug;
      this.formDescarga.setValue({
        bussinessName: dataEmitter.bussiness_name,
        rfc: dataEmitter.rfc,
        expeditionPlace: dataEmitter.expedition_place,
        taxRegime: dataEmitter.tax_regime,
        certNumber: dataEmitter.certificate_number == null ? '' : dataEmitter.certificate_number,
        passwordKey: ''
      });
      this.disableFileInput = false;
    } else {
      this.haveCerticate = false;
      this.formDescarga.reset();
      this.files = [];
      this.disableFileInput = true;
    }
    this.emitterSlugEmitter.emit(slug);
  }

  onSelect(event: { addedFiles: any }): void {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File): void {
    this.files.splice(this.files.indexOf(event), 1);
  }

  resetForm() {
    this.files = [];
    this.formDescarga.reset();
  }

  validatePassword(){
    if (this.files.length != 0) {
      this.requisitionValidate();
    }
  }

  validateKey(event: { addedFiles: any }): void {
    this.files.push(...event.addedFiles);
    this.summitFormCert = true;

    if (this.formDescarga.invalid) {
      this.files = [];
      this.fileIsInvalid = true;
      return;
    }

    this.requisitionValidate();
  }

  private requisitionValidate(): void {
    let formData = new FormData;
    formData.append('key_file', this.files[0]);
    formData.append('password', this.formDescarga.value.passwordKey);

    this._services.getValidateKey(formData, this.slugEmitter).subscribe({
      next: response => {
        let result: any = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.fileIsInvalid = false;
        } else {
          this.fileIsInvalid = true;
          this._sweetAlets.infoAlert("¡Verifica!", result.message);
          this.files = [];
        }
      },
      error: error => { console.log(error); }
    });
  }

  private validate(): boolean {
    if (this.files.length == 0) return true;
    if (this.formDescarga.invalid) return true;
    if (this.fileIsInvalid) return true;
    return false;
  }


}
