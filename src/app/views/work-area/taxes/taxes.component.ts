import { NgClass } from '@angular/common';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2'

declare var bootstrap: any

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss']
})
export class TaxesComponent implements OnInit {

  constructor(private _el: ElementRef) { }

  declare example1Data: Array<Select2OptionData>;
  declare example2Data: Array<Select2OptionData>;
  declare selectOptions: Options;
  dt1Options: DataTables.Settings = {}; //tabal de impuestos
  dt2Options: DataTables.Settings = {}; // tabla de conceptos
   
  ngOnInit(): void {

    this.dt1Options = {
      lengthMenu: [5, 10, 25, 50, 100],
      pageLength: 5,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      },
    };

    this.dt2Options = {
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      },
    };

    //inicializa los tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    let dataExampleSelect2 = [
      {
        id: 'basic1',
        text: 'Basic 1'
      },
      {
        id: 'basic2',
        text: 'Basic 2'
      },
      {
        id: 'basic3',
        text: 'Basic 3'
      },
      {
        id: 'basic4',
        text: 'Basic 4'
      }
    ];

    this.example1Data = dataExampleSelect2;
    this.example2Data = dataExampleSelect2;
 
    this.selectOptions = { 
      dropdownParent: $('#modal-nuevo-receptor')
    }
  }
  
}
