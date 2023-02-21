import { Injectable } from '@angular/core';
declare let Swal: any

@Injectable({
  providedIn: 'root'
})
export class SweetAlertsService {

  constructor() { }

  alertLoader(message?: string) {
    let messageExist = message == undefined ? "Cargando, espere un momento." : message;
    Swal.fire({
      allowOutsideClick: false,
      showConfirmButton: false,
      allowEscapeKey: false,
      width: 800,
      padding: '3em',
      background: 'rgb(0 0 123 / 0%)',
      backdrop: 'rgba(35,33,38,0.81) left top no-repeat',
      html: `
        <div class="container-loader">
          <div class="loader-timbox"></div>
          <div class="text-loader pt-3">${messageExist}</div>
        </div>
      `
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

  closeAlert() { return Swal.close() }
  
}
