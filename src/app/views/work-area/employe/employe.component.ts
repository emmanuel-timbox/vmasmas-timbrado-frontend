import { Employee } from './../../../models/employee.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { ExecelService } from 'src/app/services/excel.service';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { CatalogsService } from 'src/app/services/catalogs.service';


declare let bootstrap: any

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.scss']
})

export class EmployeComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('dateInput') dateInput!: ElementRef;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  files: File[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  submittedEdit = false;
  dataEmployees: any;
  formEditEmployee: FormGroup = new FormGroup({});
  indexArrayEployee!: number;
  slugEmployeeUpdate!: string;
  isValid: boolean = true;
  haveExcel: boolean = true;
  errorMessage!: string;
  errors: any = [];
  info: any = [];
  cfdiUsageCat!: any;
  jsonDataTaxRegiment: any;
  selectedTaxRegime!: string;

  constructor(private _service: ExecelService, private _catalogs: CatalogsService,
    private swal: SweetAlertsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      }
    };

    this.formEditEmployee = this.formBuilder.group(this._service.getDataValidateEmployees());
    this.getListEmployees();
    this.getCfdiUsageCat();
    this.getTaxRegimenCat();
  }

  get fEdit(): { [key: string]: AbstractControl } { return this.formEditEmployee.controls; }

  onSelect(event: { addedFiles: any }): void {
    this.files.push(...event.addedFiles);
    const validate = this.validateFile(this.files);

    if (!validate.isValid) {
      this.isValid = validate.isValid;
      this.errorMessage = validate.message;
      return;
    }

    this.registerExcel(event);
  }

  onRemove(event: File): void {
    this.files.splice(this.files.indexOf(event), 1);
  }

  showModalEditEmployee(dataEmployee: any, index: number): void {
    new bootstrap.Modal(this.editModal.nativeElement).show();
    this.slugEmployeeUpdate = dataEmployee.slug;
    this.indexArrayEployee = index;
    this.formEditEmployee.setValue(dataEmployee);
    this.dateInput.nativeElement.value = dataEmployee.work_start_date;
  }

  editDataEmployee(): void {

    this.submittedEdit = true;
    if (this.formEditEmployee.invalid) { return }

    const employee: Employee = this.formEditEmployee.value

    this._service.editEmployee(employee, this.slugEmployeeUpdate).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {

          this.dataEmployees[this.indexArrayEployee] = result.data;
          this.swal.successAlert('Los datos se actualizaron correctamente.');
          this.tableRerender();

        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudo actualizar los datos.');
        }
      },
      error: error => { console.log(error); }
    });
  }

  editEstatusEmployee(slugemployee: string, index: number): void {
    this._service.editStatusEmployee(slugemployee).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response))
        if (result.code == 200) {
          this.dataEmployees[index] = result.data
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
        this.dataEmployees = result.data
        this.dtTrigger.next(null);
      },
      error: error => { console.log(error); }
    });
  }

  private registerExcel(event: any): void {
    let message = 'Desea cargar el Excel.';
    this.swal.confirmationAlert(message, '¡Si, subir el archivo!').then((result: any) => {
      if (result.isConfirmed) {
        const formData: FormData = new FormData();
        formData.append('fileserexcel', this.files[0]);
        formData.append('slugUser', `${sessionStorage.getItem('slug')}`);

        this._service.insertFile(formData).subscribe({
          next: response => {
            let result = JSON.parse(JSON.stringify(response));

            console.log(result)
            if (result.code == 200) {
              const listEmployees = result.data.list_employees;

              this.errors = result.data.errors;
              this.info = result.data.info;
              this.swal.successAlert('Se guardo el Excel con exito');
              this.haveExcel = true;
              this.onRemove(event);

              if (listEmployees.length > 0) {
                listEmployees.forEach((element: any) => { this.dataEmployees.push(element); });
                this.tableRerender();
              }

            } else {
              this.onRemove(event);
              this.swal.infoAlert('¡Verifica!', `No se pudo procesar los datos del Excel.`);
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

  private tableRerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }

  private setDataEmploye(employee: any): any {
    return {
      bussiness_name: employee.bussiness_name,
      rfc: employee.rfc,
      cfdi_use: employee.cfdi_user,
      receiving_tax_domicile: employee.receiving_tax_domicile,
      recipient_tax_regimen: employee.recipient_tax_regimen,
      slug_receiver: employee.slug_receiver,
      curp: employee.curp,
      social_security_number: employee.social_security_number,
      work_start_date: employee.work_start_date,
      antiquity: employee.antiquity,
      type_contract: employee.type_contract,
      unionized: employee.unionized,
      type_working_day: employee.type_working_day,
      regime_type: employee.regime_type,
      employee_number: employee.employee_number,
      departament: employee.departament,
      job: employee.job,
      occupational_risk: employee.occupational_risk,
      payment_frequency: employee.payment_frequency,
      banck: employee.banck,
      banck_account: employee.banck_account,
      base_salary: employee.base_salary,
      daily_salary: employee.daily_salary,
      federative_entity_key: employee.federative_entity_key,
      slug_employee: employee.slug_employee
    };
  }

  private getCfdiUsageCat() {
    this._catalogs.getCfdiUsagesCat().subscribe({
      next: response => { this.cfdiUsageCat = response },
      error: error => { console.log(error); }
    });
  }

  private getTaxRegimenCat(): any {
    this._catalogs.getTaxRegimenCat().subscribe((response) => {
      this.jsonDataTaxRegiment = response;
    })
  }

}
