import { Component, Input, OnInit } from '@angular/core';

import { CatalogsService } from 'src/app/services/catalogs.service';

@Component({
  selector: 'app-xml-receiver',
  templateUrl: './xml-receiver.component.html',
  styleUrls: ['./xml-receiver.component.scss']
})
export class XmlReceiverComponent implements OnInit {

  @Input() slugEmitter!: string;

  constructor(private _catalogs: CatalogsService) { }

  CfdiUsageCat!: any;

  ngOnInit(): void {
    this.getCfdiUsagesCat
  }

  private getCfdiUsagesCat(): void {
    this._catalogs.getCfdiUsagesCat().subscribe({
      next: response => {
        this.CfdiUsageCat = response
      },
      error: error => { console.log(error) }
    })
  }

}
