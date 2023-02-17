import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { XmlPreviewService } from './../../../../services/create-xml/xml-preview.service';
import { NumberToLettersService } from './../../../../services/create-xml/number-to-letters.service';
import { CatalogsService } from './../../../../services/catalogs.service';

@Component({
  selector: 'app-xml-preview',
  templateUrl: './xml-preview.component.html',
  styleUrls: ['./xml-preview.component.scss']
})

export class XmlPreviewComponent implements OnInit {
  @Output() emitterPreview = new EventEmitter<any>();
  @Input() cfdiXml!: any
  @Input() cfdiJson!: any
  @Input() note!: string;
  @Input() keyData!: any;
  @Input() slugEmitter!: string;

  codeXmlpreview!: string;
  issueDay: any = new Date().toJSON();
  vaucherType: any = { 'E': 'Emisor', 'I': 'Ingreso', 'N': 'Nomina' };
  taxType: any = { '001': 'IVA', '002': 'ISR', '003': 'IEPS' }
  taxRegimens: any;
  taxDescriptionRegimen!: string;
  useCfdiDescription!: string;
  concepts!: any;
  numberToLatter!: string;
  userSlug: string = environment.slugUser;

  constructor(private _service: XmlPreviewService, private _catalogs: CatalogsService, private convertNumber: NumberToLettersService) { }

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
  }

  stampReceipt(): any {
    let formData = new FormData;
    formData.append('xml', this.cfdiXml);
    formData.append('slug', this.userSlug);
    formData.append('keyFile', this.keyData.keyFile);
    formData.append('keyPassword', this.keyData.password)
    formData.append('slugEmitter', this.slugEmitter)
    this._service.insertXml(formData).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        console.log(result)
        if (result.code == 200) {
          this.emitterPreview.emit({haveError: false, errorMessage: null});
        } else {
          this.emitterPreview.emit({haveError: true, errorMessage: result.error});
        }
      },
      error: error => { console.log(error); }
    });
  }

  saveVoucher(): any {

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

}
