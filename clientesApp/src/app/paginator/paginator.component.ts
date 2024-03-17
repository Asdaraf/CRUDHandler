import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() paginador: any;

  paginas: number[];

  desde: number;
  hasta: number;

  constructor() {}

  ngOnInit() {
    this.initPaginador();
  }

  ngOnChanges(changes: SimpleChanges) {
    let paginadorActualizado = changes['paginador'];

    if(paginadorActualizado.previousValue){
      this.initPaginador();
    }
  }

  private initPaginador(): void {
    this.desde = Math.min(Math.max(1, this.paginador.number-1), this.paginador.totalPages-3);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number+3), 5);

    if (this.paginador.totalPages>5) {
      this.paginas = new Array(this.hasta - this.desde+1).fill(0).map((valor, indice) => indice + this.desde); 
    } else {
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((valor, indice) => indice + 1); 
    }
    //totalPages: atributo que contiene el total de paginas. existe en los atributos del paginador
    // fill(): se utiliza para llenar el arreglo de datos
    // map(): se utiliza para modificar datos (modificar los ceros con los numeros de paginas)
  }
}
