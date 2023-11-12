import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  // Variables para almacenar los valores
  nombre: string = '';
  usuario: string = '';
  correo: string = '';
  foto: string = '';


  constructor(private menuController: MenuController) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.nombre = sessionStorage.getItem('name') || '';
    this.usuario = sessionStorage.getItem('username') || '';
    this.correo = sessionStorage.getItem('email') || '';
    this.foto = sessionStorage.getItem('profilePicture') || '';
  }

  mostrarMenu() {
    this.menuController.open('first');
  }

}
