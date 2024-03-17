import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente.model';
import { ClienteService } from './cliente.service';
import { CLIENTES } from './clientes.json';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) {}

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page')! | 0;

      if (!page) {
        page = 0;
      }

      this.clienteService
        .getClientes(page)
        .pipe(
          tap((response) => {
            console.log('ClienteService: tap 3');
            (response.content as Cliente[]).forEach((cliente) => {
              console.log(cliente.nombre);
            });
          })
        )
        .subscribe((response) => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    });

    this.modalService.notifcarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if(cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    })
    //subscribe es importante para el observable, si no nunca se visualizará. Con tap es posible tener el subscribe vacio.
  } // tambien se pueden tener diferentes tareas para el subcribe y los tap
  // subcribe nos permite subscribir dentro del flujo subcribir un observador que nos permite hacer algo
  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Estas seguro?',
        text: `Seguro que deseas eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, eliminar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.delete(cliente.id).subscribe((response) => {
            this.clientes = this.clientes.filter((cli) => cli !== cliente);
            swal.fire(
              'Cliente eliminado!',
              `Cliente ${cliente.nombre} eliminado con exito.`,
              'success'
            );
          });
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
        }
      });
  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
