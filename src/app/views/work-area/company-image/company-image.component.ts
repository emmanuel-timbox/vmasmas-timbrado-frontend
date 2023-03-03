import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-company-image',
  templateUrl: './company-image.component.html',
  styleUrls: ['./company-image.component.scss']
})

export class CompanyImageComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) pdfView!: ElementRef;
  @ViewChild('fileWaterMark', { static: false }) fileWaterMark!: ElementRef;

  haveImage: boolean = false;
  logoImage!: File;
  logoUrl!: string;

  constructor() { }

  ngOnInit(): void {
  }

  selectInput() {
    alert('Hola mundo')
  }

  importFile(event: Event) {
    const render = new FileReader();
    const elementTarge: FileList | null = (event.target as HTMLInputElement).files;

    this.logoImage = elementTarge![0];

    render.readAsDataURL(this.logoImage);
    render.onload = (event: any) => {
      this.logoUrl = event.target.result;
    }
  }

}
