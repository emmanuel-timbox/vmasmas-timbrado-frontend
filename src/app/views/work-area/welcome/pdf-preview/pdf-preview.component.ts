import { Component, Input, OnInit } from '@angular/core';
import { xml2json } from 'xml-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss']
})

export class PdfPreviewComponent implements OnInit {

  @Input() cfdiXml!: string

  // dataXml!: any;
  vaucherNode!: any;
  emitterNode!: any;
  receiverNode!: any;
  conceptsNode!: any;
  taxesNode!: any
  tdfNode!: any

  constructor() { }

  ngOnInit(): void {
    const dataXml: any = JSON.parse(xml2json(this.cfdiXml));
    this.setNodes(dataXml);
  }

  setNodes(dataXml: any): void {
    let tfd: any;
    const nodes: any = dataXml.elements[0].elements;
    const complement: any = nodes.find((item: any) => item.name == 'cfdi:Complemento')

    this.vaucherNode = dataXml.elements[0].attributes;
    this.emitterNode = nodes.find((item: any) => item.name == 'cfdi:Emisor');
    this.receiverNode = nodes.find((item: any) => item.name == 'cfdi:Receptor');
    this.conceptsNode = nodes.find((item: any) => item.name == 'cfdi:Conceptos');

    complement.elements.forEach((item: any) => {
      if (item.name == 'tfd:TimbreFiscalDigital') {
        tfd = item;
        return
      }
    });

    this.tdfNode = tfd;

  }

}
