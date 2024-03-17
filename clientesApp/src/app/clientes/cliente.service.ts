import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente.model';
import { of, Observable, map, catchError, throwError, tap } from 'rxjs'; //operador tap: tomar o hacer algo, pero sin modificar los valores en si mismo
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import swal from 'sweetalert2'
import { Router } from '@angular/router';
import { DatePipe, formatDate, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any>{
    //return of(CLIENTES);
    return this.http.get(`${this.urlEndPoint}/page/${page}`).pipe(
      tap( (response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach( cliente => { // estamos haciendo "Cast" que se refiere a la conversion de tipos de datos
          console.log(cliente.nombre);
        })
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          registerLocaleData(localeEs, 'es');
          // let datePipe = new DatePipe('es');
          //cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMM yyyy', 'es'); 
          // datePipe.transform(cliente.createAt, 'dd/MM/yyyy') (otra forma de tratarlo) 
          return cliente;
        });
        return response
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre);
        })
      })
    );
  }

  create(cliente:Cliente):Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response:any) => response.cliente as Cliente),
      catchError(e => {

        if(e.status==400){
          return throwError(() => e);
        }

        console.error(e.error.mensaje);
        swal.fire('Error al crear al cliente', e.error.mensaje, 'error')
        return throwError(() => e);
      })
    )
  }

  getCliente(id: any):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(["/clientes"]);
        console.error(e.error.mensaje);
        swal.fire("Error al editar", e.error.mensaje, "error");
        return throwError(() => e);
      })
    )
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(() => e);
        }
        
        console.error(e.error.mensaje);
        swal.fire('Error al editar al cliente', e.error.mensaje, 'error')
        return throwError(() => e);
      })
    )
  }

  delete(id: number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire('Error al eliminar al cliente', e.error.mensaje, 'error')
        return throwError(() => e);
      })
    )
  }

  subirFoto(archivo: File, id: any):Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo); // mismo nombre que le pusimos en el back-end: @RequestParam("archivo")
    formData.append("id", id);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });
    
    return this.http.request(req);
  }
}
