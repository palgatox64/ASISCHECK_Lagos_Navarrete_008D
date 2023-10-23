import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  loggedUserName: string = '';

  constructor(private menuController: MenuController, private authservice: AuthService) { 
  }

  ngOnInit() {

    this.authservice.username$.subscribe((username) => {
      console.log('Username updated:', username); // Agrega esta línea para depurar
      this.loggedUserName = username || ''; // Si es nulo, asigna una cadena vacía
    });

  }


  mostrarMenu(){
    this.menuController.open('first');
  }

}
