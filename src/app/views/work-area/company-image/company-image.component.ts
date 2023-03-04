import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';

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
  maskWatterImage!: File;
  logoUrl!: string;
  maskUrl!: string;
  textColor = 'red';

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
  }

  importFile(event: Event) {
    const render = new FileReader();
    const elementTarge: FileList | null = (event.target as HTMLInputElement).files;

    this.logoImage = elementTarge![0];
    render.readAsDataURL(this.logoImage);
    render.onload = (event: any) => { this.logoUrl = event.target.result; }
  }

  importMaskWatter(event: Event) {
    const render = new FileReader();
    const elementTarge: FileList | null = (event.target as HTMLInputElement).files;
    const styleElement = document.createElement('style');

    this.maskWatterImage = elementTarge![0];
    render.readAsDataURL(this.maskWatterImage);

    render.onload = (event: any) => {
      let style: string = `.container-pdf::before {
        content: "";
        background-size: cover;
        background: url('${event.target.result}');
        opacity: 0.1;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 900px 900px;
      }`;

      styleElement.appendChild(document.createTextNode(style));
      this.el.nativeElement.appendChild(styleElement);
    }
  }

}
