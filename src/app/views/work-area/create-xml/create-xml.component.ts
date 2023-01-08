import { Component, OnInit, ViewChild } from '@angular/core';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME, TOOLBAR_BUTTON_POSITION, } from 'ng-wizard';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { XmlCertificateComponent } from './xml-certificate/xml-certificate.component';
import { XmlReceiverComponent } from './xml-receiver/xml-receiver.component';

@Component({
  selector: 'app-create-xml',
  templateUrl: './create-xml.component.html',
  styleUrls: ['./create-xml.component.scss'],
})

export class CreateXmlComponent implements OnInit {
  
  //De esta manera puedo acceder a los metodos de padre (createXML) a sus componete hijos (todos 
  //los coponente que se encuentra en carpeta de create-xml).
  @ViewChild(XmlCertificateComponent) certificateComponent!: XmlCertificateComponent;
  @ViewChild(XmlReceiverComponent) reciverComponent!: XmlReceiverComponent;

  slugEmitterSelect!: string;
  showBottonFinish: boolean = false;
  disabledButtonNext: boolean = true;
  disableButtonPreview: boolean = true;
  numberStep!: number;

  // variables encargadas de guardar los datos que emiten los componentes hijos.
  receiveFormCertificate!: any;

  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden,
  };
  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.dots,
    toolbarSettings: {
      showPreviousButton: false,
      showNextButton: false,
    },
  };

  constructor(private ngWizardService: NgWizardService) { }

  ngOnInit(): void {
    this.ngWizardService.stepChanged().subscribe({
      next: (args) => {
        this.numberStep = args.step.index;
        this.showBottonFinish = String(args.position) == 'final' ? true : false;
        this.disabledButtonNext = String(args.position) == 'final' ? true : false;
        this.disableButtonPreview = String(args.position) == 'first' ? true : false;
      },
    });
  }

  showPreviousStep(): void {
    this.ngWizardService.previous();
  }

  showNextStep(): void {
    let canNext;
    switch (this.numberStep) {
      case 0:
        this.certificateComponent.registrerEmitterNode();
        canNext = this.receiveFormCertificate.isInValid
        break;

      case 1:

        break;

      case 2:

        break;

      case 3:

        break;

      case 4:

        break;

      case 5:

        break;
    }

    if (!canNext) { this.ngWizardService.next(); }

  }

  resetWizard() {
    this.ngWizardService.reset();
  }

  saveData() {
    console.log(this.numberStep);
    alert('Guardado');
  }

}
