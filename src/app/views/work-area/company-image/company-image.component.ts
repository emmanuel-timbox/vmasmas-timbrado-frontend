
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';
import { environment } from './../../../../environments/environment';
import { CompanyImageService } from './../../../services/company-image.service';

@Component({
  selector: 'app-company-image',
  templateUrl: './company-image.component.html',
  styleUrls: ['./company-image.component.scss']
})

export class CompanyImageComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) logoImageInput!: ElementRef;
  @ViewChild('fileWaterMark', { static: false }) fileWaterMark!: ElementRef;

  haveImage: boolean = true;
  logoImage!: File | string;
  maskWatterImage!: File | string;
  logoUrl!: string;
  maskUrl!: string;
  emitters!: any;
  emitterSlug: string = '';
  pdfImageSlug!: string;

  constructor(private _services: CompanyImageService,
    private swal: SweetAlertsService, private el: ElementRef) { }

  ngOnInit(): void {
    this.getEmitter();
  }

  importFile(event: Event): void {
    const render = new FileReader();
    const elementTarge: FileList | null = (event.target as HTMLInputElement).files;

    this.logoImage = elementTarge![0];
    render.readAsDataURL(this.logoImage);
    render.onload = (event: any) => { this.logoUrl = event.target.result; }
  }

  importMaskWatter(event: Event): void {
    const render = new FileReader();
    const elementTarge: FileList | null = (event.target as HTMLInputElement).files;

    this.maskWatterImage = elementTarge![0];
    render.readAsDataURL(this.maskWatterImage);

    render.onload = (event: any) => {
      const maskUrl = event.target.result;
      this.setImageWaterMask(maskUrl, true);
    }
  }

  getEmitter(): void {
    this._services.getEmitter().subscribe({
      next: response => {
        const result = JSON.parse(JSON.stringify(response));
        this.emitters = result.data
      },
      error: error => { console.log(error) }
    });
  }

  getImages(event: Event): void {
    const slug = (event.target as HTMLInputElement).value;

    if (slug != '') {
      this.emitterSlug = slug;
      this._services.getImages(slug).subscribe({
        next: response => {
          const result = JSON.parse(JSON.stringify(response));
          if (result.code == 200) {
            const data = result.data;
            const maskUrl = data.water_mark_image_url;

            this.haveImage = true;
            this.pdfImageSlug = data.slug
            this.logoUrl = `${environment.apiUrl}/${data.logo_image_url}`;
            this.setImageWaterMask(maskUrl, false);
            
          } else {
            this.clear();
          }
        },
        error: error => { console.log(error) }
      });
    } else {
      this.clear();
    }
  }

  setImage() {
    if (this.emitterSlug != '') {
      if (this.haveImage) this.updateImages();
      else this.saveImages();
    } else {
      const message = 'Se tiene que selecionar un Emisor antes de guardar los cambios'
      this.swal.infoAlert('¡Verifica!', message);
    }
  }

  private saveImages(): void {
    const formData = new FormData()
    formData.append('logo_image', this.logoImage);
    formData.append('water_mark_image', this.maskWatterImage);
    formData.append('slug', this.emitterSlug);

    this._services.saveImages(formData).subscribe({
      next: response => {
        const result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.haveImage = true;
          this.swal.successAlert('Se almacenaron los Imagenes.');
        } else {
          this.haveImage = false;
          this.swal.infoAlert('¡Verifica!', 'No se pudieron almacenar las imagenes.')
        }
      },
      error: error => { console.log(error) }
    });
  }

  private updateImages() {
    const formData = new FormData();
    formData.append('logo_image', this.logoImage);
    formData.append('water_mark_image', this.maskWatterImage);
    formData.append('slug', this.emitterSlug);
    formData.append('pdf_image_slug', this.pdfImageSlug)

    this._services.updateImages(formData, this.emitterSlug).subscribe({
      next: response => {
        const result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.swal.successAlert('Se actualizaron las Imagenes.');
        } else {
          this.swal.infoAlert('¡Verifica!', 'No se pudieron actualizar las imagenes.');
        }
      },
      error: error => { console.log(error); }
    });
  }

  private setImageWaterMask(maskUrl: string, isReload: boolean): void {
    const removeDiv = document.getElementById('div-style')?.remove();
    const div = document.createElement('div');

    div.setAttribute('id', 'div-style');
    this.el.nativeElement.appendChild(div);

    const url = isReload ? maskUrl : `${environment.apiUrl}/${maskUrl}`;
    const styleElement = document.createElement('style');
    const style: string = `.container-pdf::before {
        content: "";
        background-size: cover;
        background: url('${url}');
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
    div.appendChild(styleElement);
  }

  private clear() {
    this.haveImage = false;
    this.logoUrl = "";
    this.setImageWaterMask("", true);
  }

}
