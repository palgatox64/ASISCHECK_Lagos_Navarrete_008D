import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'; // Importa el componente AlertController
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = ''; // Variable para el usuario
  password: string = ''; // Variable para la contraseña
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(public alertController: AlertController, private menuController: MenuController) { } // Inyecta el componente AlertController

  ngOnInit() {
  }

  mostrarMenu() {
    this.menuController.open('first');
  }

  async autenticarLogin() {
    // Requiere agregar logica


    if (this.username === 'estudiante' && this.password === 'password') {
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Ingreso correcto.',
        buttons: ['OK']
      });

      await alert.present();
    } else {
      // Si las credenciales son incorrectas, muestra un mensaje de error
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Credenciales incorrectas. Intente nuevamente.',
        buttons: ['OK']
      });

      await alert.present();

    }



  }

}