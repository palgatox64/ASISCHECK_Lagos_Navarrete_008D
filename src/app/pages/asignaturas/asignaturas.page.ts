import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {

  asignaturas: string[] = [];
  loggedUserName: string | null = '';

  constructor( private menuController: MenuController, private authService: AuthService) { }

  ngOnInit() {
    this.loggedUserName = this.authService.getLoggedUserName();
    // Llamar al servicio para obtener las asignaturas del usuario por nombre de usuario
    if (this.loggedUserName) {
      this.authService.GetAsignaturasByUserId(this.loggedUserName).subscribe((asignaturas) => {
        this.asignaturas = asignaturas;
      });
    }
  }
  mostrarMenu(){
    this.menuController.open('first');
  }
}
