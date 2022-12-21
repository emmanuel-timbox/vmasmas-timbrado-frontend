import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare let bootstrap: any;

@Component({
  selector: 'app-receivers',
  templateUrl: './receivers.component.html',
  styleUrls: ['./receivers.component.scss']
})

export class ReceiversComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  files: File[] = [];
  dtOptions: DataTables.Settings = {};
  slug!: string | null;

  ngOnInit(): void {
    let tooltipAfter = [].slice.call(document.querySelectorAll('[class="tooltip bs-tooltip-auto fade show"]'));
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

    tooltipAfter.map(function (item) {
      const elem: HTMLElement = item;
      elem.remove()
    });

    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    this.slug = this.route.snapshot.paramMap.get('slug');
    
    this.dtOptions = {
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
      },
    };
  }


  ngAfterViewChecked() { }

  onSelect(event: { addedFiles: any; }) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

}
