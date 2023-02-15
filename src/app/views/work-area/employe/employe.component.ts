import { environment } from 'src/environments/environment';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExecelService } from 'src/app/services/excel.service';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { Subject } from 'rxjs';
import { FormGroup,AbstractControl, FormBuilder } from '@angular/forms';
import { Employe } from 'src/app/models/employe.model';

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
  slugEmployeeUpdate!: string;



  constructor(private route: ActivatedRoute, private _service: ExecelService,
    private swal: SweetAlertsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getListEmployees();
    this.formEditEmployee = this.formBuilder.group(this._service.getDataValidateEmployees());

  }

  get fEdit(): { [key: string]: AbstractControl } { return this.formEditEmployee.controls; }

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


  showModalEditEmployee(dataEployees: any, index: number): void {
    console.log(dataEployees)
    new bootstrap.Modal(this.editModal.nativeElement).show();
    this.slugEmployeeUpdate = dataEployees.slug

    this.formEditEmployee.setValue({
      rfc: dataEployees.rfc,
      curp: dataEployees.curp,
      social_security_number: dataEployees.social_security_number,
      work_start_date: dataEployees.work_start_date,
      antiquity: dataEployees.antiquity,
      type_contract: dataEployees.type_contract,
      unionized: dataEployees.unionized,
      type_working_day: dataEployees.type_working_day,
      regime_type: dataEployees.regime_type,
      employee_number: dataEployees.employee_number,
      departament: dataEployees.departament,
      risk_put: dataEployees.risk_put,
      put: dataEployees.put,
      payment_frequency: dataEployees.payment_frequency,
      banck: dataEployees.banck,
      banck_account: dataEployees.banck_account,
      base_salary: dataEployees.base_salary,
      daily_salary: dataEployees.daily_salary,
      federative_entity_key: dataEployees.federative_entity_key

    });


  }

  editDataEmployee(): void {
    this.submittedEdit = true;
    if (this.formEditEmployee.invalid) { return }


    const Employe: Employe = {

      rfc: this.formEditEmployee.value.rfc,
      curp: this.formEditEmployee.value.curp,
      social_security_number: this.formEditEmployee.value.social_security_number,
      antiquity: this.formEditEmployee.value.antiquity,
      work_start_date: this.formEditEmployee.value.work_start_date,
      type_contract: this.formEditEmployee.value.type_contract,
      unionized: this.formEditEmployee.value.unionized,
      type_working_day: this.formEditEmployee.value.type_working_day,
      regime_type: this.formEditEmployee.value.regime_type,
      employee_number: this.formEditEmployee.value.employee_number,
      departament: this.formEditEmployee.value.departament,
      risk_put: this.formEditEmployee.value.risk_put,
      put: this.formEditEmployee.value.put,
      payment_frequency: this.formEditEmployee.value.payment_frequency,
      banck: this.formEditEmployee.value.banck,
      banck_account: this.formEditEmployee.value.banck_account,
      base_salary: this.formEditEmployee.value.base_salary,
      daily_salary: this.formEditEmployee.value.daily_salary,
      federative_entity_key: this.formEditEmployee.value.federative_entity_key

    }
    this._service.editEmployee(Employe, this.slugEmployeeUpdate).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.dataEployees[this.indexArrayEployee] = result.data
          this.swal.successAlert('Los datos se actualizaron de manera correcta');
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar los datos');
        }
      },
      error: error => { console.log(error) }
    })
  }

  editEstatusEmployee(slugemployee: string, index: number): void {
    this._service.editStatusEmployee(slugemployee).subscribe({
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
