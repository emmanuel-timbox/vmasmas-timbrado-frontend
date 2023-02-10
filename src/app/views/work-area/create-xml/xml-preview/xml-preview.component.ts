import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-xml-preview',
  templateUrl: './xml-preview.component.html',
  styleUrls: ['./xml-preview.component.scss']
})
export class XmlPreviewComponent implements OnInit {

  @Input() cfdiXml!: any

  codeXmlpreview!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
