import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild  } from '@angular/core';
import { NgWizardConfig, NgWizardService, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { MassiveService } from 'src/app/services/massive.service';
import {AbstractControl, FormGroup, FormsModule} from '@angular/forms';


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
  
  constructor(private _services: MassiveService,) { }

  ngOnInit(): void {
  }

  get f(): { [key: string]: AbstractControl }{ return this.formDescarga.controls; }


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

  

}
