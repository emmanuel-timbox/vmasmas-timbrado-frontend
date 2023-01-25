import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertificateService } from 'src/app/services/certificate.service';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})

export class CertificatesComponent implements OnInit {

  constructor(private route: ActivatedRoute, private _service: CertificateService,
    private swal: SweetAlertsService) { }

  files: File[] = [];
  slug!: string | null;
  isValid: boolean = true;
  haveCerticate: boolean = true;
  errorMessage!: string;
  certificateData: any = {
    certificate_number: '',
    rfc: '',
    identity: '',
    verified_by: '',
    data_expity: ''
  };

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.getCertificate();
  }

  ngAfterViewChecked() { }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    let validate = this.validateFile(this.files);

    if (!validate.isValid) {
      this.isValid = validate.isValid;
      this.errorMessage = validate.message;
      return;
    }

    if (!this.haveCerticate) {
      this.registerCertificate(event);
    } else {
      this.replaceCertificate(event);
    }
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  private registerCertificate(event: any): void {
    let message = 'Desea cargar el Certificado.';
    this.swal.confirmationAlert(message, '¡Si, subir el archivo!').then((result: any) => {
      if (result.isConfirmed) {
        const formData: FormData = new FormData();
        formData.append('certificate', this.files[0]);
        formData.append('slugEmitter', String(this.slug));

        this._service.insertFile(formData).subscribe({
          next: response => {
            let result = JSON.parse(JSON.stringify(response));

            if (result.code == 200) {
              this.onRemove(event);
              this.certificateData = result.data;
              this.swal.successAlert('Se guardo el Certificado con exito');
              this.haveCerticate = true;
            } else {
              this.onRemove(event);
              this.swal.infoAlert('¡Verifica!', `No se pudo guardar el Certificado. ${result.message}`);
            }

          },
          error: error => { console.log(error); }
        });
      } else {
        this.onRemove(event);
      }
    });
  }

  private replaceCertificate(event: any): void {
    let message = `Ya se encuentra registado un Certificado, desea remplazar el antiguo con este Certficado.`
    this.swal.confirmationAlert(message, '¡Si, guardar y remplazar!').then((result: any) => {
      if (result.isConfirmed) {
        let formData: FormData = new FormData();
        let slugCertificate: string = this.certificateData.slug;
        formData.append('certificate', this.files[0]);
        formData.append('slugEmitter', String(this.slug))

        this._service.updateFile(formData, slugCertificate).subscribe({
          next: response => {
            let result = JSON.parse(JSON.stringify(response));

            if (result.code == 200) {
              this.onRemove(event);
              this.certificateData = result.data;
              this.swal.successAlert('Se guardo el Certificado con exito');
              this.haveCerticate = true;
            } else {
              this.onRemove(event);
              this.swal.infoAlert('¡Verifica!', `No se pudo guardar el Certificado. ${result.message}`);
            }

          },
          error: error => { console.log(error); }
        });

      } else {
        this.onRemove(event);
      }
    });
  }

  private getCertificate(): void {
    this._service.getCertificate(String(this.slug)).subscribe({
      next: response => {
        let result = JSON.parse(JSON.stringify(response));
        if (result.code == 200) {
          this.haveCerticate = true;
          this.certificateData = result.data;
        } else {
          this.haveCerticate = false;
        }
      },
      error: error => { console.log(error); }
    });
  }

  private validateFile(file: any): any {
    const allowedExtension = /(.*?)\.(cer)$/;

    if (file.length > 1) {
      return {
        isValid: false,
        message: 'Solo se tiene que cargar un archivo en la caja.'
      };
    }

    if (file[0].name.match(allowedExtension) == null) {
      return {
        isValid: false,
        message: 'El archivo no es valido, solo es valido los .cer para cargar.'
      };
    }

    return { isValid: true, message: null };
  }


}
