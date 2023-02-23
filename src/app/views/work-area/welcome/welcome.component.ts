import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { WelcomeService } from './../../../services/welcome.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataXml!: any;
  typeVaoucher: any = { 'I': 'Ingreso', 'E': 'Egreso', 'N': 'Nomina' };
  showTable: boolean = true;
  xml!: string;
  uuid!: string;

  constructor(private _service: WelcomeService) { }

  ngOnInit(): void {
    this.dtOptions = {
      lengthMenu: [5, 10, 25, 50, 100],
      pageLength: 25,
      language: { url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json' },
      destroy: true
    };

    this.getDataXml();
  }

  getDataXml(): void {
    this._service.getXmlsData().subscribe({
      next: response => {
        const result: any = JSON.parse(JSON.stringify(response));
        this.dataXml = result.data;
        this.dtTrigger.next(null);
      },
      error: error => { console.log(error); }
    });
  }

  downloadXml(uuid: string, xml: string): void {
    const link: any = document.createElement("a");
    const file: Blob = new Blob([xml], { type: 'text/xml' });
    link.href = URL.createObjectURL(file);
    link.download = `${uuid}.xml`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  showPdfPreview(xml: string): void {
    this.showTable = false;
    this.xml = xml;
  }

}
