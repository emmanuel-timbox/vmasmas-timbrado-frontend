import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExecelService } from 'src/app/services/excel.service';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';


@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.scss']
})

export class EmployeComponent implements OnInit {

  constructor(private route: ActivatedRoute,private _service: ExecelService,
     private swal: SweetAlertsService) { }

  ngOnInit(): void {

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
        formData.append('slug',environment.slugUser);


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



}
