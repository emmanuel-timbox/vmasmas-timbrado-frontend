import { environment } from 'src/environments/environment';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Emitter } from 'src/app/models/emitter.model';
import { ExecelService } from 'src/app/services/excel.service';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

declare let bootstrap: any

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.scss']
})

export class EmployeComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  submittedCreate = false;
  submittedEdit = false;
  jsonDataEmployeeRegiment: any;
  dataEployees: any;
  dataEployeeEdit: any;
  formNewEmployee: FormGroup = new FormGroup({});
  formEditEmployee: FormGroup = new FormGroup({});
  indexArrayEployee!: number;
  slugEmitterUpdate!: string;


  constructor(private route: ActivatedRoute, private _service: ExecelService,
    private swal: SweetAlertsService) { }

  ngOnInit(): void {
    this.getListEmployees();
  }

  excel: File[] = [];
  isValid: boolean = true;
  haveExcel: boolean = true;
  errorMessage!: string;

  onSelect(event: any) {
    this.excel.push(...event.addedFiles);
    let validate = this.validateFile(this.excel);

    if (!validate.isValid) {
      this.isValid = validate.isValid;
      this.errorMessage = validate.message;
      return;
    }
    this.registerExcel(event);
  }

  onRemove(event: File) {
    this.excel.splice(this.excel.indexOf(event), 1);
  }

  private registerExcel(event: any): void {
    let message = 'Desea cargar el Excel.';
    this.swal.confirmationAlert(message, '¡Si, subir el archivo!').then((result: any) => {
      if (result.isConfirmed) {
        const formData: FormData = new FormData();
        formData.append('fileserexcel', this.excel[0]);
        formData.append('slug', environment.slugUser);


        this._service.insertFile(formData).subscribe({
          next: response => {
            let result = JSON.parse(JSON.stringify(response));

            if (result.code == 200) {
              this.onRemove(event);
              this.excel = result.data;
              this.swal.successAlert('Se guardo el Excel con exito');
              this.haveExcel = true;
            } else {
              this.onRemove(event);
              this.swal.infoAlert('¡Verifica!', `No se pudo guardar el Excel. ${result.message}`);
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
    const allowedExtension = /(.*?)\.(xlsx)$/;

    if (file.length > 1) {
      return {
        isValid: false,
        message: 'Solo se tiene que cargar un archivo en la caja.'
      };
    }

    if (file[0].name.match(allowedExtension) == null) {
      return {
        isValid: false,
        message: 'El archivo no es valido, solo es valido los .xlsx para cargar.'
      };
    }

    return { isValid: true, message: null };
  }


  showModalEditEmitter(dataEployees: any, index: number): void {
    new bootstrap.Modal(this.editModal.nativeElement).show();
    this.indexArrayEployee = index;
    this.slugEmitterUpdate = dataEployees.slug;
    this.formEditEmployee.setValue({
      bussinessName: dataEployees.bussiness_name,
      rfc: dataEployees.rfc,
      expeditionPlace: dataEployees.expedition_place,
      taxRegime: dataEployees.tax_regime
    });
  }

  editEstatusEmitter(slugEmitter: string, index: number): void {
    this._service.editStatusEmployee(slugEmitter).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response))
        if (result.code == 200) {
          this.dataEployees[index] = result.data
          this.swal.successAlert('El estatus se actualizo de manera correcta');
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar el estatus');
        }
      },
      error: error => { console.log(error) }
    });
  }

  private getListEmployees() {
    this._service.getdataEmployees().subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        this.dataEployees = result.data
        
      },
      error: error => { console.log(error) }
    });
  }

}
