import { Component, Input, OnInit } from '@angular/core';
import { CatalogsService } from 'src/app/services/catalogs.service';
import { XmlReceiverService } from 'src/app/services/create-xml/xml-receiver.service';

@Component({
  selector: 'app-xml-receiver',
  templateUrl: './xml-receiver.component.html',
  styleUrls: ['./xml-receiver.component.scss']
})
export class XmlReceiverComponent implements OnInit {

  constructor(private _catalogs: CatalogsService, private _services: XmlReceiverService) { }

  CfdiUsageCat!: any;
  receiversList: any;

  ngOnInit(): void {
    this.getCfdiUsagesCat;
  }

  getReceivers(slug: string): void {
    this._services.getReceivers(slug).subscribe({
      next: response => {
        console.log(response)
        this.receiversList = JSON.parse(JSON.stringify(response)).data;
      },
      error: error => { console.log(error) }
    })
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
