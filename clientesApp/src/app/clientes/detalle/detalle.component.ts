import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  public fotoSeleccionada: File | null = null;
  public progreso: number = 0;

  constructor(private clienteService: ClienteService, public modalService: ModalService) {}
  
  ngOnInit() {}

  seleccionarFoto(event:any) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);

    if(this.fotoSeleccionada) {

      if(this.fotoSeleccionada.type.indexOf('image') < 0) {
        swal.fire('Error seleccionar imagen: ', 'El archivo seleccionado debe ser tipo imagen', 'error');
        this.fotoSeleccionada = null;
      }
    }
  }

  subirFoto() {
    if(!this.fotoSeleccionada) {
      swal.fire('Error Upload: ', 'Debes seleccionar una foto', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          if(event.total){
            this.progreso = Math.round((event.loaded / event.total)*100);
          }
        } else if (event.type === HttpEventType.Response) {
          let response:any = event.body;
          this.cliente = response.cliente as Cliente;

          this.modalService.notifcarUpload.emit(this.cliente); // emitimos una señal con el cliente actualizado
          swal.fire("La foto se ha subido completamente", `La foto se ha subido con exito: ${this.cliente.foto}`, 'success');
        }
        // this.cliente = cliente;
      })
    }
  }

  cerrarModal() {
    this.modalService.modal = false;
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
}
