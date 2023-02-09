import { Component, OnInit, ViewChild } from '@angular/core';
import { NgWizardConfig, NgWizardService, STEP_STATE, THEME } from 'ng-wizard';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { XmlCertificateComponent } from './xml-certificate/xml-certificate.component';
import { XmlReceiverComponent } from './xml-receiver/xml-receiver.component';
import { XmlVaucherComponent } from './xml-vaucher/xml-vaucher.component';
import { XmlConceptsComponent } from './xml-concepts/xml-concepts.component';
import * as xml2js from 'xml2js';
import * as JsonToXML from 'js2xmlparser';
import { data } from 'jquery';

@Component({
  selector: 'app-create-xml',
  templateUrl: './create-xml.component.html',
  styleUrls: ['./create-xml.component.scss'],
})

export class CreateXmlComponent implements OnInit {

  //De esta manera puedo acceder a los metodos de padre (createXML) a sus componete hijos (todos
  //los coponente que se encuentra en carpeta de create-xml).
  @ViewChild(XmlCertificateComponent) certificateComponent!: XmlCertificateComponent;
  @ViewChild(XmlVaucherComponent) vaucherComponent!: XmlVaucherComponent;
  @ViewChild(XmlReceiverComponent) reciverComponent!: XmlReceiverComponent;
  @ViewChild(XmlConceptsComponent) conceptComponent!: XmlConceptsComponent;

  slugEmitterSelect!: string;
  showBottonFinish: boolean = false;
  disabledButtonNext: boolean = true;
  disableButtonPreview: boolean = true;
  isPayRoll: boolean = false
  numberStep!: number;
  stepTitle!: string;

  // variables encargadas de guardar los datos que emiten los componentes hijos.
  certificateData!: any;
  vaucherData!: any;
  receiverData!: any;
  conceptData!: any;
  keyFile!: any;

  //receptor para poder ejecutar los datos de los datos del componente
  // hijo
  receiveFormCertificate!: any;
  reciverFormVaucher!: any;
  receiverFormReceiver!: any;
  receiverFormConcept!: any;

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

  constructor(private ngWizardService: NgWizardService, private swal: SweetAlertsService) { }

  ngOnInit(): void {
    this.ngWizardService.stepChanged().subscribe({
      next: (args) => {
        this.numberStep = args.step.index;
        this.showBottonFinish = String(args.position) == 'final' ? true : false;
        this.disabledButtonNext = String(args.position) == 'final' ? true : false;
        this.disableButtonPreview = String(args.position) == 'first' ? true : false;
        this.stepTitle = args.step.title;
      },
    });
  }

  showPreviousStep(): void {
    this.ngWizardService.previous();
  }

  showNextStep(): void {
    let canNext!: boolean;
    switch (this.numberStep) {
      case 0:
        this.certificateComponent.registrerEmitterNode();
        this.reciverComponent.getReceivers(this.slugEmitterSelect);
        this.certificateData = this.receiveFormCertificate
        canNext = this.receiveFormCertificate.isInvalid;
        break;

      case 1:
        this.vaucherComponent.registerFormVaucher();
        this.vaucherData = this.reciverFormVaucher;
        canNext = this.reciverFormVaucher.isInvalid;
        break;

      case 2:
        this.reciverComponent.registrerReceiveNode();
        this.receiverData = this.receiverFormReceiver;
        canNext = this.receiverFormReceiver.isInvalid;
        break;

      case 3:
        this.conceptComponent.regitrerConcept();
        this.conceptData = this.receiverFormConcept;
        canNext = this.receiverFormConcept.isInvalid;
        break

      case 4:

        break;

      case 5:

        break;
    }
    // por cuestiones de test se comenta
    // if (!canNext) { this.ngWizardService.next(); }
    this.ngWizardService.next();
  }

  resetWizard() {
    this.ngWizardService.reset();
  }

  saveData() {
    let message: string = 'Crear Comprobante';
    this.swal.confirmationAlert(message, '¡Si crear!').then((result: any) => {
      if (result.isConfirmed) {
        //Realizar la operacion en caso de que no si se confirme
        if (this.stepTitle == 'Conceptos') {
          this.conceptComponent.regitrerConcept();

          if (this.receiverFormConcept.isInvalid) {
            message = 'Se tiene que registrar al menos un Concepto antes de generar un Comprobante';
            this.swal.infoAlert('¡Revisa!', message);
            return;
          }
          this.conceptData = this.receiverFormConcept;

        } else {

        }
      }
    });
  }

  createXml() {
    let dataCertificate = this.certificateData.formCerticate;
    let dataConcept = this.conceptData.conceptForm;
    let dataVaucher = this.vaucherData.formVaucher;

    let xmlJson: any = {
      '@': {
        'xmlns:cfdi': 'http://www.sat.gob.mx/cfd/4',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd',
        Fecha: '',
        Sello: '',
        Certificado: '',
        NoCertificado: dataCertificate.certNumber,
        Version: '4.0',
        Moneda: dataVaucher.coin,
        SubTotal: dataConcept.subtotal,
        Total: dataConcept.total,
        TipoDeComprobante: dataVaucher.voucherType,
        Exportacion: dataVaucher.export,
        LugarExpedicion: dataCertificate.expeditionPlace,
      },
      'cfdi:Emisor': {
        '@': {
          Rfc: '',
          Nombre: '',
          RegimenFiscal: ''
        }
      }
    };

    if (dataVaucher.invoice != '') xmlJson['@']['Folio'] = dataVaucher.invoice;
    if (dataVaucher.serie != '') xmlJson['@']['Serie'] = dataVaucher.serie;
    if (dataConcept.discount != '0.00')  xmlJson['@']['Descuento'] = dataConcept.discount;
    if (dataVaucher.payMethod != '')  xmlJson['@']['FormaPago'] = dataVaucher.payMethod;
    if (dataVaucher.wayToPay != '')  xmlJson['@']['MetodoPago'] = dataVaucher.wayToPay;

    console.log(xmlJson['@'])

    console.log(JsonToXML.parse('cfdi:Comprobante', xmlJson))
  }

}
