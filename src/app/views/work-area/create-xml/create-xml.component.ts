import { Component, OnInit, ViewChild } from '@angular/core';
import { NgWizardConfig, NgWizardService, STEP_STATE, THEME } from 'ng-wizard';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { XmlCertificateComponent } from './xml-certificate/xml-certificate.component';
import { XmlReceiverComponent } from './xml-receiver/xml-receiver.component';
import { XmlVaucherComponent } from './xml-vaucher/xml-vaucher.component';
import { XmlConceptsComponent } from './xml-concepts/xml-concepts.component';
import * as JsonToXML from 'js2xmlparser';

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
  cfdi!: any;

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
    if (!canNext) { this.ngWizardService.next(); }
    // this.ngWizardService.next();
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
          this.cfdi = this.createXml();
          console.log(this.cfdi);

        } else {
          //esta parte se va generar xml pero de nomina
        }
      }
    });
  }

  private createXml(): any {
    let dataCertificate = this.certificateData.formCerticate;
    let dataConcept = this.conceptData.conceptForm;
    let dataVaucher = this.vaucherData.formVaucher;
    let dataReceiver = this.receiverData.formReceiver;

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
          Rfc: dataCertificate.rfc,
          Nombre: dataCertificate.bussinessName,
          RegimenFiscal: dataCertificate.taxRegime
        }
      },
      'cfdi:Receptor': {
        '@': {
          Rfc: dataReceiver.rfc,
          Nombre: dataReceiver.bussinessName,
          DomicilioFiscalReceptor: dataReceiver.taxDomicile,
          RegimenFiscalReceptor: dataReceiver.taxRegime,
          UsoCFDI: dataReceiver.cfdiUse
        }
      },
      'cfdi:Conceptos': this.assembleConceptNode(dataConcept)
    };

    let taxNode = this.assembleTaxtNode(dataConcept)
    if (Object.keys(taxNode).length > 0) xmlJson['cfdi:Impuestos'] = this.assembleTaxtNode(dataConcept);

    // atributos condicionales o opcionales de nodos de Comprobante
    if (dataVaucher.invoice != '') xmlJson['@']['Folio'] = dataVaucher.invoice;
    if (dataVaucher.serie != '') xmlJson['@']['Serie'] = dataVaucher.serie;
    if (dataConcept.discount != '0.00') xmlJson['@']['Descuento'] = dataConcept.discount;
    if (dataVaucher.payMethod != '') xmlJson['@']['FormaPago'] = dataVaucher.payMethod;
    if (dataVaucher.wayToPay != '') xmlJson['@']['MetodoPago'] = dataVaucher.wayToPay;

    //atributos opcionales del nodo de Receptor
    if (dataReceiver.fiscalIdNumber != '') xmlJson['cfdi:Receptor']['@']['NumRegIdTrib'] = dataReceiver.fiscalIdNumber;
    if (dataReceiver.taxResidence != '') xmlJson['cfdi:Receptor']['@']['ResidenciaFiscal'] = dataReceiver.taxResidence;

    return JsonToXML.parse('cfdi:Comprobante', xmlJson);
  }

  private assembleConceptNode(dataConcept: any): any {
    let conceptResult: any = { 'cfdi:Concepto': [] };

    dataConcept.concepts.forEach((concept: any) => {
      let data: any = {
        '@': {
          ClaveProdServ: concept.productKey,
          Cantidad: concept.quantity,
          ClaveUnidad: concept.unitKey,
          Descripcion: concept.description,
          ValorUnitario: concept.unitValue,
          Importe: concept.amount,
          ObjetoImp: concept.taxObject
        }
      };

      if (concept.discount != '') data['@']['Descuento'] = concept.discount;
      if (concept.idNumber != '') data['@']['NoIdentificacion'] = concept.idNumber;
      if (concept.unit != '') data['@']['Unidad'] = concept.unit;

      //Armado de impuestos por tipo Retencion o Traslado
      if (concept.taxForm.length > 0) {
        let transfers: any = [];
        let withholdings: any = [];

        data['cfdi:Impuestos'] = {};

        concept.taxForm.forEach((tax: any) => {
          if (tax.nodeType == 'Traslado') {
            let transfer = {
              '@': {
                Base: tax.base,
                Impuesto: tax.tax,
                TipoFactor: tax.typeFactor,
                TasaOCuota: tax.shareRate,
                Importe: tax.amount
              }
            };
            transfers.push(transfer);
          }

          if (tax.nodeType == 'Retencion') {
            let retention = {
              '@': {
                Base: tax.base,
                Impuesto: tax.tax,
                TipoFactor: tax.typeFactor,
                TasaOCuota: tax.shareRate,
                Importe: tax.amount
              }
            };
            withholdings.push(retention);
          }
        });

        if (transfers.length > 0) data['cfdi:Impuestos']['cfdi:Traslados'] = { 'cfdi:Traslado': transfers };
        if (withholdings.length > 0) data['cfdi:Impuestos']['cfdi:Retenciones'] = { 'cfdi:Retencion': withholdings };
      }

      conceptResult['cfdi:Concepto'].push(data);
    });

    return conceptResult;
  }

  private assembleTaxtNode(dataConcepts: any): any {
    let amountResult: any = {};
    let transfers: any = [];
    let withholdings: any = [];

    dataConcepts.concepts.forEach((concept: any) => {
      concept.taxForm.forEach((tax: any) => {
        if (tax.nodeType == 'Traslado') transfers.push(tax);
        if (tax.nodeType == 'Retencion') withholdings.push(tax);
      });
    });

    if (transfers.length > 0) {
      let result: any = [];
      let resultTransfers: any = this.agroupTransferTax(transfers);

      resultTransfers.forEach((element: any) => {
        let tax = {
          '@': {
            Base: element.base,
            Impuesto: element.tax,
            TipoFactor: element.typeFactor,
            TasaOCuota: element.shareRate,
            Importe: element.amount
          }
        };
        result.push(tax);
      });

      amountResult['cfdi:Traslados'] = { 'cfdi:Traslado': result };
    }

    if (withholdings.length > 0) {
      let result: any = []
      let resultWithholdings: any = this.agroupWithholdingsTax(withholdings);

      resultWithholdings.forEach((element: any) => {
        let tax = {
          '@': {
            Impuesto: element.tax,
            Importe: element.amount
          }
        };
        result.push(tax);
      });

      amountResult['cfdi:Retenciones'] = { 'cfdi:Retencion': result };
    }

    return amountResult;
  }

  private agroupTransferTax(rawTax: any): any {
    const resultData = rawTax.reduce((arrGroup: any, current: any) => {

      let thatItem: any = arrGroup.find((item: any) => (item.tax == current.tax
        && item.typeFactor == current.typeFactor && item.shareRate == current.shareRate));

      if (thatItem == undefined) arrGroup = [...arrGroup, { ...current }];
      else {
        current.amount = Number(current.amount);
        thatItem.amount = Number(thatItem.amount);
        thatItem.amount += current.amount;
      }
      return arrGroup;
    }, []);

    return resultData
  }

  private agroupWithholdingsTax(rawTax: any): any {
    const resultData = rawTax.reduce((arrGroup: any, current: any) => {

      let thatItem: any = arrGroup.find((item: any) => (item.tax == current.tax));

      if (thatItem == undefined) arrGroup = [...arrGroup, { ...current }];
      else {
        current.amount = Number(current.amount);
        thatItem.amount = Number(thatItem.amount);
        thatItem.amount += current.amount;
      }
      return arrGroup;
    }, []);

    return resultData
  }

}
