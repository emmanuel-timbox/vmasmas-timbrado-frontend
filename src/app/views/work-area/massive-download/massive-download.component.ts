import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgWizardConfig, NgWizardService, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { MassiveService } from 'src/app/services/massive.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Massive } from 'src/app/models/massive.model';
import { Subject } from 'rxjs';

declare let bootstrap: any


@Component({
  selector: 'app-massive-download',
  templateUrl: './massive-download.component.html',
  styleUrls: ['./massive-download.component.scss']
})
export class MassiveDownloadComponent implements OnInit {
  @Output() emitterSlugEmitter = new EventEmitter<string>();
  @ViewChild('modalmassive') modalmassive!: ElementRef;

  files: File[] = [];
  slug!: string | null;
  emitterData: any;
  haveCerticate!: Boolean;
  summitFormCert = false;
  submitteshow = false;
  formDescarga: FormGroup = new FormGroup({});
  dataMassive: any;
  dataPackages: any;
  slugEmitter!: string;
  fileIsInvalid!: boolean;
  disableFileInput: boolean = true;
  isValid: boolean = true;
  errorMessage!: string;
  formNewSolicitud: FormGroup = new FormGroup({});
  formShow: FormGroup = new FormGroup({});
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  formmassivepaquetes: FormGroup = new FormGroup({});
  statusDescription: any = {
    '0': "Incidencia SAT.",
    '1': "Solicitud Aceptada",
    '2': "En Proceso",
    '3': "Solicitud Terminada",
    '4': "Error",
    '5': "Rechazada",
    '5-2': "Se agotó las solicitudes de por vida ",
    '5-3': "Los parámetros de la consulta se supero el tope máximo",
    '5-4': "No se encontró la información",
    '5-5': "Solicitud duplicada",
    '6': "Vencida.",
    '7': "Procesando descarga de Paquetes",
    '8': "Listo para Descargar",
    '9': "Cancelada.",
  }


  constructor(private _services: MassiveService, private swal: SweetAlertsService,
    private _sweetAlets: SweetAlertsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.dtOptions = {
      lengthMenu: [5, 10, 25, 50, 100],
      pageLength: 5,
      language: { url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json' },
      destroy: true
    };

    this.getEmitterData()
    this.getListMassive();
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

  private getListMassive() {
    this._services.getMassiveData().subscribe({
      next: response => {

        let result = JSON.parse(JSON.stringify(response));
        console.log(result.data)
        this.dataMassive = result.data


        this.dtTrigger.next(null);
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
    formData.append('rfc', this.formDescarga.value.rfc);
    formData.append('RfcReceptor', this.formDescarga.value.RfcReceptor);
    formData.append('RfcSolicitante', this.formDescarga.value.RfcSolicitante);
    formData.append('correo', this.formDescarga.value.correo);
    formData.append('FechaInicial', this.formDescarga.value.FechaInicial + ':00');
    formData.append('FechaFinal', this.formDescarga.value.FechaFinal + ':00');
    formData.append('Complemento', this.formDescarga.value.Complemento);
    formData.append('TipoSolicitud', this.formDescarga.value.TipoSolicitud);
    formData.append('TipoComprobante', this.formDescarga.value.TipoComprobante);
    formData.append('uuid', this.formDescarga.value.uuid);
    formData.append('rfcR_uuid', this.formDescarga.value.rfcR_uuid);
    formData.append('password', this.formDescarga.value.password);
    formData.append('slug_emitter', this.slugEmitter);
    const slugUser = `${sessionStorage.getItem('slug')}`
    formData.append('user_slug', slugUser);


    this._services.insertDataMassive(formData).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        let massive = result.data;
          if (result.code == 200) {
            this.swal.successAlert('Solicitud  correcta');
            this.resetFormCreate();
          } else {
            this.swal.infoAlert('¡Verifica!', 'No se aaaaaaa guardar los datos de manera correcta');
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
        message: 'Solo se tiene que cargar dos archivos en la caja.'
      };
    }

    if (file[0].name.match(allowedExtension) == null) {
      return {
        isValid: false,
        message: 'El archivo no es valido, solo es valido los .cer y key para cargar.'
      };
    }

    return { isValid: true, message: null };
  }


  openUrl(url: string) {
    console.log(url)
    window.open(url)
  }

  showModalPackages(idResquestSat: string): void {
    new bootstrap.Modal(this.modalmassive.nativeElement).show();


    this._services.getMassivePackages(idResquestSat).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.dataPackages = result.data;
        } else {
          this._sweetAlets.infoAlert('¡Verifica!', 'No se encuentra ');
        }
      },
      error: error => { console.log(error) }
    });

  }







}
