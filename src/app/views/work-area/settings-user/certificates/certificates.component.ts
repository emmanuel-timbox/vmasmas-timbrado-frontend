import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare let bootstrap: any;

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})

export class CertificatesComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  files: File[] = [];
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
