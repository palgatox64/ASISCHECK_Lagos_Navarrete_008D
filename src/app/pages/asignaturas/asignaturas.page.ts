import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {

 

  constructor( private menuController: MenuController, private authService: AuthService) { }

  ngOnInit() {
   
  }
  mostrarMenu(){
    this.menuController.open('first');
  }
}
