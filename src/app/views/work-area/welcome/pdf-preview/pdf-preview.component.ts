import { CatalogsService } from './../../../../services/catalogs.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { xml2json } from 'xml-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from './../../../../../environments/environment';
import { NumberToLettersService } from 'src/app/services/create-xml/number-to-letters.service';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss']
})

export class PdfPreviewComponent implements OnInit {

  @Output() emitterPreview = new EventEmitter<any>();
  @Input() cfdiXml!: string

  vaucherType: any = { 'E': 'Emisor', 'I': 'Ingreso', 'N': 'Nomina' };
  taxType: any = { '001': 'IVA', '002': 'ISR', '003': 'IEPS' }
  payMethod: any = { 'PUE': 'Pago en una sola exhibición', 'PPD': 'Pago en parcialidades o diferido' }
  voucherNode!: any;
  emitterNode!: any;
  receiverNode!: any;
  conceptsNode!: any;
  taxesNode!: any
  tdfNode!: any
  urlQr!: string
  originalString!: string;
  numberToLatter!: string;
  wayToPayDescription!: string;

  constructor(private _catalogs: CatalogsService, private convertNumber: NumberToLettersService) { }

  ngOnInit(): void {
    const dataXml: any = JSON.parse(xml2json(this.cfdiXml));
    this.setNodes(dataXml);

  }

  setNodes(dataXml: any): void {
    let tfd: any;
    const nodes: any = dataXml.elements[0].elements;
    const complement: any = nodes.find((item: any) => item.name == 'cfdi:Complemento')

    this.voucherNode = dataXml.elements[0].attributes;
    this.emitterNode = nodes.find((item: any) => item.name == 'cfdi:Emisor');
    this.receiverNode = nodes.find((item: any) => item.name == 'cfdi:Receptor');
    this.conceptsNode = nodes.find((item: any) => item.name == 'cfdi:Conceptos');
    this.taxesNode = nodes.find((item: any) => item.name == 'cfdi:Impuestos')

    console.log(this.taxesNode);
    complement.elements.forEach((item: any) => {
      if (item.name == 'tfd:TimbreFiscalDigital') {
        tfd = item;
        return
      }
    });

    this.numberToLatter = this.convertNumber.numeroALetras(this.voucherNode.Total, {
      plural: 'PESOS',
      singular: 'PESOS',
      centPlural: '/100 M.N.',
      centSingular: '/100 M.N.'
    });

    this.tdfNode = tfd;
    this.urlQr = this.getUrlQr();
    this.originalString = this.generateStringOrigin()

    this.getWayToPay(this.voucherNode.FormaPago);
  }

  showTable(): void { this.emitterPreview.emit(false); }

  private getUrlQr(): string {
    const tfd = this.tdfNode.attributes;
    const emitter: any = this.emitterNode.attributes;
    const receiver: any = this.receiverNode.attributes;
    return `${environment.urlQr}?id=${tfd.UUID}%26re=${emitter.Rfc}%26rr=${receiver.Rfc}%26tt=${receiver.Total}%26fe=${tfd.SelloCFD}`
  }

  private generateStringOrigin(): string {
    const tfd = this.tdfNode.attributes;
    return `||${tfd.UUID}|${tfd.FechaTimbrado}|${tfd.RfcProvCertif}|${tfd.SelloCFD}|${tfd.SelloSAT}|${tfd.NoCertificadoSAT}||`
  }

  private getWayToPay(cfdiPayToWay: string): void {
    this._catalogs.getPayMethodsCat().subscribe((response) => {
      let wayToPays: any = response;
      let wayToPay: any = wayToPays.find((element: any) => element.forma_pago == cfdiPayToWay);
      this.wayToPayDescription = wayToPay.descripcion;
    })
  }


}
