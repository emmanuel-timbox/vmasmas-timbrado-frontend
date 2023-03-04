import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgWizardConfig, NgWizardService, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { MassiveService } from 'src/app/services/massive.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Massive } from 'src/app/models/massive.model';


@Component({
  selector: 'app-massive-download',
  templateUrl: './massive-download.component.html',
  styleUrls: ['./massive-download.component.scss']
})
export class MassiveDownloadComponent implements OnInit {
  @Output() emitterSlugEmitter = new EventEmitter<string>();

  files: File[] = [];
  slug!: string | null;
  emitterData: any;
  haveCerticate!: Boolean;
  summitFormCert = false;
  formDescarga: FormGroup = new FormGroup({});
  slugEmitter!: string;
  fileIsInvalid!: boolean;
  disableFileInput: boolean = true;
  isValid: boolean = true;
  errorMessage!: string;
  formNewSolicitud: FormGroup = new FormGroup({});



  constructor(private _services: MassiveService, private swal: SweetAlertsService, private _sweetAlets: SweetAlertsService, private formBuilder: FormBuilder) { }

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


  massive(): void {
    this.summitFormCert = true;
    if (this.formDescarga.invalid) { return }

    const massive: Massive = {
      rfc: this.formDescarga.value.rfc,

      rfc_receptor: this.formDescarga.value.rfc_receptor,
      correo: this.formDescarga.value.correo,
      fechaIncial: this.formDescarga.value.fechaIncial,
      fechafinal: this.formDescarga.value.fechafinal, 
      complemento: this.formDescarga.value.complemento,
      tipo_so: this.formDescarga.value.tipo_so,
      rfc_acuentaAterceros: this.formDescarga.value.rfc_acuentaAterceros,
      tipo_com: this.formDescarga.value.tipo_com,
      uuid: this.formDescarga.value.uuid, 
      rfcR_uuid: this.formDescarga.value.rfcR_uuid,

      slugUser: `${sessionStorage.getItem('slug')}`
    };

    this._services.insertDataMassive(massive).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        let emitter = result.data;
        if (result.code == 200) {
          this.swal.successAlert('Los datos del Emisor se guardaron de manera correcta');
          this.resetFormCreate();
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo guardar los datos de manera correcta');
          this.resetFormCreate();
        }
      },
      error: error => { console.log(error) }
    });
  }

  resetFormCreate(): void {
    this.summitFormCert = false;
    this.formDescarga.reset();
  }

  // newRequest(slugEmitter: string, index: number): void {
  //   this._services.insertFile(slugEmitter).subscribe({
  //     next: response => {
  //       let result = JSON.parse(JSON.stringify(response))
  //       if (result.code == 200) {
  //         this.dataMassive[index] = result.data
  //         this.swal.successAlert('Peticion enviada');
  //       } else {
  //         this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar el estatus');
  //       }
  //     },
  //     error: error => { console.log(error) }
  //   });
  // }

  setDataEmitterInput(event: Event): void {
    let dataEmitter!: any
    let slug: string = (event.target as HTMLInputElement).value;

    console.log(slug)
    if (slug == '') {
      this.formDescarga.reset();
      this.disableFileInput = true;
      this.files = []
      return;
    }

    dataEmitter = this.emitterData.find((x: any) => x.slug == slug);
    this.formDescarga.get('rfc')?.setValue(dataEmitter.rfc)
      console.log(dataEmitter)


  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    let validate = this.validateFile(this.files);

    if (!validate.isValid) {
      this.isValid = validate.isValid;
      this.errorMessage = validate.message;
      return;
    }

    if (!this.haveCerticate) {
      this.registerCertificates(event);
    }
  }


  onRemove(event: File): void {
    this.files.splice(this.files.indexOf(event), 1);
  }


  private registerCertificates(event: any): void {
    let message = 'Desea cargar el Certificado.';
    this.swal.confirmationAlert(message, '¡Si, subir el archivo!').then((result: any) => {
      if (result.isConfirmed) {
        const formData: FormData = new FormData();
        formData.append('certificate', this.files[0]);
        formData.append('slugEmitter', String(this.slug));

        this._services.insertFile(formData).subscribe({
          next: response => {
            let result = JSON.parse(JSON.stringify(response));

            if (result.code == 200) {
              this.onRemove(event);
              this.files = result.data;
              this.swal.successAlert('Se guardo el Certificado con exito');
              this.haveCerticate = true;
            } else {
              this.onRemove(event);
              this.swal.infoAlert('¡Verifica!', `No se pudo guardar el Certificado. ${result.message}`);
            }

          },
          error: error => { console.log(error); }
        });
      } else {
        this.onRemove(event);
      }
    });
  }

 
  private validateFile(file: any): any {
    const allowedExtension = /(.*?)\.(cer)$/;

    if (file.length > 1) {
      return {
        isValid: false,
        message: 'Solo se tiene que cargar un archivo en la caja.'
      };
    }

    if (file[0].name.match(allowedExtension) == null) {
      return {
        isValid: false,
        message: 'El archivo no es valido, solo es valido los .cer para cargar.'
      };
    }

    return { isValid: true, message: null };
  }

  


}
