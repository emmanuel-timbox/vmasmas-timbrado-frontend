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


  constructor(private _services: MassiveService, private swal: SweetAlertsService, 
    private _sweetAlets: SweetAlertsService, private formBuilder: FormBuilder) { }

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
    let cerf!: File;
    let key!: File;
    this.files.forEach((item: any) => {
      const nameSplit = item.name.split(".");
      if (nameSplit[1] == "cer") { cerf = item }
      if (nameSplit[1] == "key") { key = item }
    });
    const formData: FormData = new FormData();

    formData.append("cer_file", cerf);
    formData.append("key_file", key);
    formData.append('userId', this.formDescarga.value.userId);
    formData.append('rfc', this.formDescarga.value.rfc);
    formData.append('rfc_receptor', this.formDescarga.value.rfc_receptor);
    formData.append('correo', this.formDescarga.value.correo);
    formData.append('fechaIncial', this.formDescarga.value.fechaIncial);
    formData.append('fechafinal', this.formDescarga.value.fechafinal);
    formData.append('complemento', this.formDescarga.value.complemento);
    formData.append('tipo_so', this.formDescarga.value.tipo_so);
    formData.append('tipo_com', this.formDescarga.value.tipo_com);
    formData.append('uuid', this.formDescarga.value.uuid);
    formData.append('rfcR_uuid', this.formDescarga.value.rfcR_uuid); 
    formData.append('password', this.formDescarga.value.password); 
    formData.append('slug_emitter' , this.slugEmitter);
     const slugUser = `${sessionStorage.getItem('slug')}`
     formData.append('user_slug' , slugUser);
    //  formData.append('slug', slug);

    this._services.insertDataMassive(formData).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        let massive = result.data;
        if (result.code == 200) {
          this.swal.successAlert('Los datos de la solicitud se guardaron de manera correcta');
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
    this.formDescarga.get('rfc')?.setValue(dataEmitter.rfc);
     this.slugEmitter = slug;
  }

  onSelect(event: { addedFiles: any }): void {
    this.files.push(...event.addedFiles);
    console.log(this.files)
  }


  onRemove(event: File): void {
    this.files.splice(this.files.indexOf(event), 1);
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
