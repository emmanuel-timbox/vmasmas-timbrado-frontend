import { Component, ElementRef, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME, TOOLBAR_BUTTON_POSITION } from 'ng-wizard';

@Component({
  selector: 'app-create-xml',
  templateUrl: './create-xml.component.html',
  styleUrls: ['./create-xml.component.scss']
})

export class CreateXmlComponent implements OnInit {
  
  formResultCertificate: any
  isValidTypeBoolean: boolean = true;
  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };
  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.dots,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Guardar', class: 'btn btn-info w-finish-button btn-w-fanal-summit mr-2', event: () => { alert("Finished!!!"); } },
        { text: 'Reiniciar', class: 'btn btn-danger', event: () => { this.resetWizard() } }
      ],
    }
  };

  
  
  constructor(private ngWizardService: NgWizardService, private _el: ElementRef) { }

  ngOnInit(): void {
    
  }


  resetWizard() {
    this.ngWizardService.reset();
  }

  stepChanged(args: StepChangedArgs) {
    this.prueba();
    let steperIndex = args.step.index;
    let btnSummit = this._el.nativeElement.getElementsByClassName('btn-w-fanal-summit')
    this._el.nativeElement.getElementsByClassName('ng-wizard-btn-prev')[0].textContent = 'Previo'
    this._el.nativeElement.getElementsByClassName('ng-wizard-btn-next')[0].textContent = 'Siguiente'
    if (steperIndex == 6) {
      btnSummit[0].classList.remove('d-none')
    } else {
      btnSummit[0].classList.add('d-none')
    }
  }

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    console.log(args)
    return true;
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }

  prueba(): void { 
    console.log(this.formResultCertificate);
  }


}
