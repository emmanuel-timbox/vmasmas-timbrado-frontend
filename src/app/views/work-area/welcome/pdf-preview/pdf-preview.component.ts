import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { xml2json } from 'xml-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from './../../../../../environments/environment';
import { NumberToLettersService } from 'src/app/services/create-xml/number-to-letters.service';
import { WelcomeService } from './../../../../services/welcome.service';
import { SweetAlertsService } from './../../../../services/sweet-alert.service';
import { CatalogsService } from './../../../../services/catalogs.service';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss']
})

export class PdfPreviewComponent implements OnInit {
  @ViewChild('pdfView', { static: false }) pdfView!: ElementRef;

  @Output() emitterPreview = new EventEmitter<any>();
  @Input() cfdiXml!: string;
  @Input() note!: string;
  @Input() dataEmitter!: any;

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
  transfersTax!: any;
  withholdingsTax!: any
  logoImageUrl!: string;

  constructor(private _services: WelcomeService, private _catalogs: CatalogsService,
    private convertNumber: NumberToLettersService, private swal: SweetAlertsService,
    private el: ElementRef) { }

  ngOnInit(): void {
    const dataXml: any = JSON.parse(xml2json(this.cfdiXml));
    this.setNodes(dataXml);
    this.getImagesPdf();
  }

  setNodes(dataXml: any): void {
    let tfd: any;
    const nodes: any = dataXml.elements[0].elements;
    const complement: any = nodes.find((item: any) => item.name == 'cfdi:Complemento')

    this.voucherNode = dataXml.elements[0].attributes;
    this.emitterNode = nodes.find((item: any) => item.name == 'cfdi:Emisor');
    this.receiverNode = nodes.find((item: any) => item.name == 'cfdi:Receptor');
    this.conceptsNode = nodes.find((item: any) => item.name == 'cfdi:Conceptos');
    this.taxesNode = nodes.find((item: any) => item.name == 'cfdi:Impuestos');

    if (this.taxesNode.elements != undefined) {
      this.withholdingsTax = this.taxesNode.elements.find((item: any) => item.name == 'cfdi:Retenciones');
      this.transfersTax = this.taxesNode.elements.find((item: any) => item.name == 'cfdi:Traslados');
    }

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

  openPdf(): void {
    let DATA: any = this.pdfView.nativeElement;

    html2canvas(DATA, { allowTaint: true, useCORS: true }).then(canvas => {
      let HTML_Width = canvas.width;
      let HTML_Height = canvas.height;
      let top_left_margin = 15;
      let PDF_Width = HTML_Width + (top_left_margin * 2);
      let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      let canvas_image_width = HTML_Width;
      let canvas_image_height = HTML_Height;
      let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
      canvas.getContext('2d');

      let imgData = canvas.toDataURL("image/jpeg", 1.0);
      let pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);

      for (let i = 1; i <= totalPDFPages; i++) {
        pdf.addPage([PDF_Width, PDF_Height], 'p');
        pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) +
          (top_left_margin * 4), canvas_image_width, canvas_image_height);
      }

      pdf.autoPrint();
      pdf.output('dataurlnewwindow');
    });

  }

  downloadPdf(uuid: string): void {
    const message = 'Descargando, espere un momento'
    const DATA: any = this.pdfView.nativeElement;

    this.swal.alertLoader(message);

    html2canvas(DATA, { allowTaint: true, useCORS: true }).then(canvas => {
      let HTML_Width = canvas.width;
      let HTML_Height = canvas.height;
      let top_left_margin = 15;
      let PDF_Width = HTML_Width + (top_left_margin * 2);
      let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      let canvas_image_width = HTML_Width;
      let canvas_image_height = HTML_Height;
      let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
      canvas.getContext('2d');

      let imgData = canvas.toDataURL("image/jpeg", 1.0);
      let pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);

      for (let i = 1; i <= totalPDFPages; i++) {
        pdf.addPage([PDF_Width, PDF_Height], 'p');
        pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) +
          (top_left_margin * 4), canvas_image_width, canvas_image_height);
      }

      pdf.save(`${uuid}.pdf`);
    });

    this.swal.closeAlert();
  }

  private getImagesPdf(): void {
    this._services.getImagePdf(this.dataEmitter.slugEmitter).subscribe({
      next: response => {
        const result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          const images = result.data;
          const logoImageUrl = `${environment.apiUrl}/${images.logo_image_url}`;

          this.setImageWaterMask(images.water_mark_image_url);

          this.toDataUrl(logoImageUrl, (myBase64: string) => {
            this.logoImageUrl = myBase64;
          });

        } else {
          const message = 'No tiene registrado las images de su PDF.';
          this.swal.infoAlert('¡Verifica!', message);
        }
      },
      error: error => { console.log(error); }
    });
  }

  private getUrlQr(): string {
    const tfd = this.tdfNode.attributes;
    const emitter: any = this.emitterNode.attributes;
    const receiver: any = this.receiverNode.attributes;
    return `${environment.urlQr}?id=${tfd.UUID}%26re=${emitter.Rfc}%26rr=${receiver.Rfc}%26tt=${receiver.Total}%26fe=${tfd.SelloCFD}`;
  }

  private generateStringOrigin(): string {
    const tfd = this.tdfNode.attributes;
    return `||${tfd.UUID}|${tfd.FechaTimbrado}|${tfd.RfcProvCertif}|${tfd.SelloCFD}|${tfd.SelloSAT}|${tfd.NoCertificadoSAT}||`;
  }

  private getWayToPay(cfdiPayToWay: string): void {
    this._catalogs.getPayMethodsCat().subscribe((response) => {
      let wayToPays: any = response;
      let wayToPay: any = wayToPays.find((element: any) => element.forma_pago == cfdiPayToWay);
      this.wayToPayDescription = wayToPay.descripcion;
    });
  }

  private setImageWaterMask(maskUrl: string): void {
    const removeDiv = document.getElementById('div-style')?.remove();
    const div = document.createElement('div');

    div.setAttribute('id', 'div-style');
    this.el.nativeElement.appendChild(div);

    const url = `${environment.apiUrl}/${maskUrl}`;
    const styleElement = document.createElement('style');
    const style: string = `.container-pdf::before {
        content: "";
        background-size: cover;
        background: url('${url}');
        opacity: 0.1;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 900px 900px;
      }`;

    styleElement.appendChild(document.createTextNode(style));
    div.appendChild(styleElement);
  }

  private toDataUrl(url: string, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

}
