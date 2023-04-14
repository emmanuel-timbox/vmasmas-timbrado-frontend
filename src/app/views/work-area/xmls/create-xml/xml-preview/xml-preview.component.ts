import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { xml2json } from 'xml-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { XmlPreviewService } from '../../../../../services/create-xml/xml-preview.service';
import { NumberToLettersService } from '../../../../../services/create-xml/number-to-letters.service';
import { CatalogsService } from '../../../../../services/catalogs.service';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-xml-preview',
  templateUrl: './xml-preview.component.html',
  styleUrls: ['./xml-preview.component.scss']
})

export class XmlPreviewComponent implements OnInit {
  @ViewChild('pdfView', { static: false }) pdfView!: ElementRef;
  @Output() emitterPreview = new EventEmitter<any>();
  @Input() cfdiXml!: any
  @Input() cfdiJson!: any
  @Input() note!: string;
  @Input() keyData!: any;
  @Input() slugEmitter!: string;
  @Input() address!: string;
  @Input() companyName!: string;

  codeXmlpreview!: string;
  issueDay: any = new Date().toJSON();
  vaucherType: any = { 'E': 'Emisor', 'I': 'Ingreso', 'N': 'Nomina' };
  taxType: any = { '001': 'IVA', '002': 'ISR', '003': 'IEPS' }
  payMethod: any = { 'PUE': 'Pago en una sola exhibición', 'PPD': 'Pago en parcialidades o diferido' }
  taxRegimens: any;
  taxDescriptionRegimen!: string;
  useCfdiDescription!: string;
  concepts!: any;
  numberToLatter!: string;
  userSlug: string = `${sessionStorage.getItem('slug')}`;
  itIsSuccess: boolean = false;
  wayToPayDescription!: any;
  uuid!: string;
  urlQr!: string;
  logoImageUrl!: string;
  dataCertificate: any = {
    fiscalFolio: '',
    digitalStamp: '',
    satStamp: '',
    originalStringStamp: '',
    emitteDate: '',
    certificateNoSat: ''
  }

  constructor(private _service: XmlPreviewService, private _catalogs: CatalogsService,
    private convertNumber: NumberToLettersService, private swal: SweetAlertsService,
    private el: ElementRef) { }

  ngOnInit(): void {
    this.getTaxRegimenCat(this.cfdiJson['cfdi:Emisor']['@']['RegimenFiscal']);
    this.getCfdiUsageCat(this.cfdiJson['cfdi:Receptor']['@']['UsoCFDI']);
    this.concepts = this.cfdiJson['cfdi:Conceptos']['cfdi:Concepto'];
    let total = Number(this.cfdiJson['@']['Total']);
    this.numberToLatter = this.convertNumber.numeroALetras(total, {
      plural: 'PESOS',
      singular: 'PESOS',
      centPlural: '/100 M.N.',
      centSingular: '/100 M.N.'
    });
    this.getImagesPdf();

    if (this.cfdiJson['@']['FormaPago'] != undefined) this.getWayToPay(this.cfdiJson['@']['FormaPago']);
  }

  stampReceipt(): any {
    this.swal.alertLoader();

    let formData = new FormData;
    formData.append('xml', this.cfdiXml);
    formData.append('keyFile', this.keyData.keyFile);
    formData.append('keyPassword', this.keyData.password);
    formData.append('slugEmitter', this.slugEmitter);
    formData.append('note', this.note);

    this._service.insertXml(formData).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          const jsonCfdi: any = JSON.parse(xml2json(result.data));
          const nodes: any = jsonCfdi.elements[0].elements;
          let tfdData: any;
          this.issueDay = jsonCfdi.elements[0].attributes.Fecha;
          this.cfdiXml = result.data
          this.emitterPreview.emit({ haveError: false, errorMessage: null, itItSuccess: true });
          this.itIsSuccess = true;
          nodes.forEach((data: any) => {
            if (data.name == 'cfdi:Complemento') {
              tfdData = data.elements.find((item: any) => item.name == 'tfd:TimbreFiscalDigital');
              return;
            }
          });
          this.dataCertificate = {
            fiscalFolio: tfdData.attributes.UUID,
            digitalStamp: tfdData.attributes.SelloCFD,
            satStamp: tfdData.attributes.SelloSAT,
            originalStringStamp: this.generateStringOrigin(tfdData),
            stampedDate: tfdData.attributes.FechaTimbrado,
            certificateNoSat: tfdData.attributes.NoCertificadoSAT
          };
          this.uuid = tfdData.attributes.UUID;
          this.urlQr = this.getUrlQr(tfdData)
          this.swal.successAlert('Timbrado de manera correcta');
        } else {
          this.emitterPreview.emit({ haveError: true, errorMessage: result.error, itItSuccess: false });
          this.itIsSuccess = false;
          this.swal.closeAlert();
        }
      },
      error: error => { console.log(error); }
    });
  }

  getUrlQr(tfd: any) {
    return `https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=${tfd.attributes.UUID}%26re=${this.cfdiJson['cfdi:Emisor']['@']['Rfc']}%26rr=${this.cfdiJson['cfdi:Receptor']['@']['Rfc']}%26tt=${this.cfdiJson['@']['Total']}%26fe=${tfd.attributes.SelloCFD}`
  }

  saveVoucher(): any { }

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

  donwloadXml(uuid: string): void {
    const link: any = document.createElement("a");
    const file: Blob = new Blob([this.cfdiXml], { type: 'text/xml' });
    link.href = URL.createObjectURL(file);
    link.download = `${uuid}.xml`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  private getImagesPdf(): void {
    this._service.getImagesPdf(this.slugEmitter).subscribe({
      next: response => {
        const result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          const images = result.data;
          const logoImageUrl = `${environment.apiUrl}/${images.logo_image_url}`
          this.setImageWaterMask(images.water_mark_image_url);

          this.toDataUrl(logoImageUrl, (myBase64: string) => {
            this.logoImageUrl = myBase64;
          });

        } else {
          const message = 'No tiene registrado las images de su PDF.';
          this.swal.infoAlert('¡Verifica!', message);
        }
      },
      error: error => { console.log(error) }
    });
  }

  private getWayToPay(cfdiPayToWay: string): void {
    this._catalogs.getPayMethodsCat().subscribe((response) => {
      let wayToPays: any = response;
      let wayToPay: any = wayToPays.find((element: any) => element.forma_pago == cfdiPayToWay);
      this.wayToPayDescription = wayToPay.descripcion;
    })
  }

  private getTaxRegimenCat(regime: string): any {
    this._catalogs.getTaxRegimenCat().subscribe((response) => {
      let taxRegimens: any = response;
      let taxRagime: any = taxRegimens.find((element: any) => element.regime == regime);
      this.taxDescriptionRegimen = taxRagime.descripcion;
    });
  }

  private getCfdiUsageCat(useCfdiValue: string) {
    this._catalogs.getCfdiUsagesCat().subscribe({
      next: response => {
        let useCfdis: any = response;
        let useCfdi: any = useCfdis.find((element: any) => element.uso_cfdi == useCfdiValue);
        this.useCfdiDescription = useCfdi.descripcion;
      },
      error: error => { console.log(error); }
    })
  }

  private generateStringOrigin(tfd: any) {
    const attributes = tfd.attributes;
    return `||${attributes.UUID}|${attributes.FechaTimbrado}
    |${attributes.RfcProvCertif}|${attributes.SelloCFD}|${attributes.SelloSAT}|${attributes.NoCertificadoSAT}||`
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
