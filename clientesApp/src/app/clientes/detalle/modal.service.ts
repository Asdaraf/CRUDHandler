import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  
  modal: boolean = false;

  private notificarUplado = new EventEmitter<any>();

  constructor() { }

  get notifcarUpload(): EventEmitter<any> {
    return this.notificarUplado;
  }

  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }
}
