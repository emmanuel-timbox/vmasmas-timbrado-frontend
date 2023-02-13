import { NumberToLettersService } from './../../../../services/create-xml/number-to-letters.service';
import { CatalogsService } from './../../../../services/catalogs.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-xml-preview',
  templateUrl: './xml-preview.component.html',
  styleUrls: ['./xml-preview.component.scss']
})
export class XmlPreviewComponent implements OnInit {

  @Input() cfdiXml!: any
  @Input() cfdiJson!: any
  @Input() note!: string;

  codeXmlpreview!: string;
  issueDay: any = new Date().toJSON();
  vaucherType: any = { 'E': 'Emisor', 'I': 'Ingreso', 'N': 'Nomina' };
  taxType: any = { '001': 'IVA', '002': 'ISR', '003': 'IEPS' }
  taxRegimens: any;
  taxDescriptionRegimen!: string;
  useCfdiDescription!: string;
  concepts!: any;
  numberToLatter!: string;

  constructor(private _catalogs: CatalogsService, private convertNumber: NumberToLettersService) { }

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
