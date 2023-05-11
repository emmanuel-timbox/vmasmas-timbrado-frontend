import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { MassiveService } from 'src/app/services/massive.service';

declare let bootstrap: any

@Component({
  selector: 'app-massive-download',
  templateUrl: './massive-download.component.html',
  styleUrls: ['./massive-download.component.scss']
})

export class MassiveDownloadComponent implements OnInit {
  @Output() emitterSlugEmitter = new EventEmitter<string>();
  @ViewChild('modalmassive') modalmassive!: ElementRef;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  files: File[] = [];
  emitterData: any;
  summitFormCert = false;
  formDescarga: FormGroup = new FormGroup({});
  dataMassive: any;
  dataPackages: any;
  slugEmitter!: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  isReadonly: boolean = true;
  messageFileError!: string;
  isValidFile: boolean = true;
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
  };

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

  massive(): void {
    let cerf!: File;
    let key!: File;
    const formData: FormData = new FormData();
    const slugUser = `${sessionStorage.getItem('slug')}`;
    const validateFiles = this.validateFile(this.files);

    this.summitFormCert = true

    if (!validateFiles.isValid) {
      this.messageFileError = validateFiles.message;
      this.isValidFile = validateFiles.isValid;
      return;
    }

    if (this.formDescarga.invalid) { return; }

    this.isValidFile = true;

    this.files.forEach((item: any) => {
      const nameSplit = item.name.split(".");
      if (nameSplit[1] == "cer") { cerf = item; }
      if (nameSplit[1] == "key") { key = item; }
    });

    formData.append("cerFile", cerf);
    formData.append("keyFile", key);
    formData.append('rfc', this.formDescarga.value.rfc);
    formData.append('rfcReceptor', this.formDescarga.value.rfcReceptor);
    formData.append('rfcSolicitante', this.formDescarga.value.rfcSolicitante);
    formData.append('correo', this.formDescarga.value.correo);
    formData.append('fechaInicial', this.formDescarga.value.fechaInicial + ':00');
    formData.append('fechaFinal', this.formDescarga.value.fechaFinal + ':00');
    formData.append('tipoSolicitud', this.formDescarga.value.tipoSolicitud);
    formData.append('complemento', this.formDescarga.value.complemento);
    formData.append('rfcACuentaTerceros', this.formDescarga.value.rfcACuentaTerceros);
    formData.append('tipoComprobante', this.formDescarga.value.tipoComprobante);
    formData.append('estadoComprobante', this.formDescarga.value.estadoComprobante);
    formData.append('password', this.formDescarga.value.password);
    formData.append('slugEmitter', this.slugEmitter);
    formData.append('slugUser', slugUser);
    // formData.append('uuid', this.formDescarga.value.uuid);
    // formData.append('rfcUuid', this.formDescarga.value.rfcUuid);

    this._services.insertDataMassive(formData).subscribe({
      next: response => {
        const result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.swal.successAlert(result.message);
          this.dataMassive.push(result.data);
          this.resetFormCreate();
          this.tableRerender();
        } else {
          this.swal.infoAlert('¡Verifica!', result.message);
          // this.resetFormCreate();
        }
      },
      error: error => { console.log(error) }
    });
  }

  resetFormCreate(): void {
    this.summitFormCert = false;
    this.formDescarga.reset();
    this.files = [];
  }

  setDataEmitterInput(event: Event): void {
    let dataEmitter!: any;
    let slug: string = (event.target as HTMLInputElement).value;

    if (slug == '') {
      this.isReadonly = true;
      this.formDescarga.reset();
      this.files = [];
      return;
    }

    dataEmitter = this.emitterData.find((x: any) => x.slug == slug);
    this.formDescarga.get('rfc')?.setValue(dataEmitter.rfc);
    this.slugEmitter = slug;
    this.isReadonly = false;
  }

  onSelect(event: { addedFiles: any }): void {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File): void {
    this.files.splice(this.files.indexOf(event), 1);
  }

  openUrl(url: string) {
    // console.log(url)
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
          this._sweetAlets.infoAlert('¡Verifica!', 'No se encuentra');
        }
      },
      error: error => { console.log(error) }
    });
  }

  private getListMassive() {
    this._services.getMassiveData().subscribe({
      next: response => {
        const result = JSON.parse(JSON.stringify(response));
        this.dataMassive = result.data
        this.dtTrigger.next(null);
      },
      error: error => { console.log(error) }
    });
  }

  private validateFile(files: any): any {
    const allowedExtensionCer = /(.*?)\.(cer)$/;
    const allowedExtensionKey = /(.*?)\.(key)$/;
    let countCer: number = 0;
    let countKey: number = 0;

    if (files.length == 0) {
      return {
        isValid: false,
        message: 'Este campo es requerido'
      };
    }

    if (files.length > 2) {
      return {
        isValid: false,
        message: 'Solo se tiene que cargar dos archivos en la caja'
      };
    }

    this.files.forEach((element: any) => {
      if (element.name.match(allowedExtensionCer) != null) {
        countCer++;
      }

      if (element.name.match(allowedExtensionKey) != null) {
        countKey++;
      }
    });

    if (countCer > 1) {
      return {
        isValid: false,
        message: 'Solo se tiene que cargar un archivo .cer'
      };
    }

    if (countKey > 1) {
      return {
        isValid: false,
        message: 'Solo se tiene que cargar un archivo .key'
      };
    }

    if (countCer == 1 && countKey != 1) {
      return {
        isValid: false,
        message: 'Se tiene que cargar un archivo .key junto con un .cer'
      };
    }

    if (countCer != 1 && countKey == 1) {
      return {
        isValid: false,
        message: 'Se tiene que cargar un archivo .cer junto con un .key'
      };
    }

    return { isValid: true, message: null };
  }

  private tableRerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }

}
