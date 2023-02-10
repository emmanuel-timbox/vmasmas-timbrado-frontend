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

  codeXmlpreview!: string;
  issueDay: any = new Date().toJSON();
  vaucherType: any = { 'E': 'Emisor', 'I': 'Ingreso', 'N': 'Nomina' };
  taxType: any = { '001': 'IVA', '002': 'ISR', '003': 'IEPS' }
  taxRegimens: any;
  taxDescriptionRegimen!: string;
  useCfdiDescription!: string;
  concepts!: any;

  constructor(private _catalogs: CatalogsService) { }

  ngOnInit(): void {

    this.cfdiJson = {
      "@": {
        "xmlns:cfdi": "http://www.sat.gob.mx/cfd/4",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xsi:schemaLocation": "http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd",
        "Fecha": "",
        "Sello": "",
        "Certificado": "",
        "NoCertificado": "30001000000400002335",
        "Version": "4.0",
        "Moneda": "MXN",
        "SubTotal": "15129.00",
        "Total": "17549.64",
        "TipoDeComprobante": "E",
        "Exportacion": "01",
        "LugarExpedicion": "12345",
        "Descuento": "123"
      },
      "cfdi:Emisor": {
        "@": {
          "Rfc": "12123456PRUEBA",
          "Nombre": "Prueba",
          "RegimenFiscal": "603"
        }
      },
      "cfdi:Receptor": {
        "@": {
          "Rfc": "1234562312RFC",
          "Nombre": "Emmanuel",
          "DomicilioFiscalReceptor": "12347",
          "RegimenFiscalReceptor": "612",
          "UsoCFDI": "D04"
        }
      },
      "cfdi:Conceptos": {
        "cfdi:Concepto": [
          {
            "@": {
              "ClaveProdServ": "10101500",
              "Cantidad": 123,
              "ClaveUnidad": "18",
              "Descripcion": "Producto de pruebas",
              "ValorUnitario": 123,
              "Importe": "15129.00",
              "ObjetoImp": "02",
              "NoIdentificacion": "123",
              "Unidad": "KGR"
            },
            "cfdi:Impuestos": {
              "cfdi:Traslados": {
                "cfdi:Traslado": [
                  {
                    "@": {
                      "Base": "15129.00",
                      "Impuesto": "002",
                      "TipoFactor": "Tasa",
                      "TasaOCuota": "0.160000",
                      "Importe": "2420.64"
                    }
                  }
                ]
              }
            }
          }
        ]
      },
      "cfdi:Impuestos": {
        "cfdi:Traslados": {
          "cfdi:Traslado": [
            {
              "@": {
                "Base": "15129.00",
                "Impuesto": "001",
                "TipoFactor": "Tasa",
                "TasaOCuota": "0.160000",
                "Importe": "2420.64"
              }
            },
            {
              "@": {
                "Base": "15129.00",
                "Impuesto": "001",
                "TipoFactor": "Tasa",
                "TasaOCuota": "0.060000",
                "Importe": "2420.64"
              }
            }
          ]
        },

        "cfdi:Retenciones": {
          'cfdi:Retencion': [
            {
              "@": {
                "Impuesto": "003",
                "Importe": "449.68"
              }
            },
            {
              "@": {
                "Impuesto": "002",
                "Importe": "449.68"
              }
            }
          ]
        }

      }
    }

    this.getTaxRegimenCat(this.cfdiJson['cfdi:Emisor']['@']['RegimenFiscal']);
    this.getCfdiUsageCat(this.cfdiJson['cfdi:Receptor']['@']['UsoCFDI']);
    this.concepts = this.cfdiJson['cfdi:Conceptos']['cfdi:Concepto']
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
      error: error => { console.log(error) }
    })
  }
}
