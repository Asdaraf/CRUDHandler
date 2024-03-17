import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'clientesApp';
  curso:string="Bienvenido al curso Angular 16 y Spring";
  profesor:string="Andrés Guzmán";
}
