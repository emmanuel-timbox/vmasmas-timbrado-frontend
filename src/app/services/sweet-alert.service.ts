import { Injectable } from '@angular/core';
declare let Swal: any

@Injectable({
  providedIn: 'root'
})
export class SweetAlertsService {

  constructor() { }

  alertLoader() {
    Swal.fire({
      title: 'Espere un momento...',
      allowOutsideClick: false,
      showConfirmButton: false,
      allowEscapeKey: false,
      width: 600,
      padding: '3em',
      background: 'rgb(0 0 123 / 0%)',
      backdrop: 'rgba(0,0,123,0.4) left top no-repeat',
      html: '<div className="col-sm-12"><div class="loader loader--snake"></div>'
    });
  }

  successAlert(text: string) {
    Swal.fire('¡Exito!', text, 'success')
  }

  infoAlert(mensaje: string, text: string) {
    Swal.fire(mensaje, text, 'info')
  }

  confirmationAlert(message: string, messageConfirmation?: string) {
    return Swal.fire({
      title: '¿Esta seguro?',
      text: `${message}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: messageConfirmation == undefined ? '¡Si, borralo!' : messageConfirmation,
      cancelButtonText: 'Cancelar'
    });
  }
}
