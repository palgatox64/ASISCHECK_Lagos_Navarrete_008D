import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AutorizadoGuard {

  constructor(private router: Router,
    private alertController: AlertController,
    private authservice: AuthService,
    private toastcontroller: ToastController) {}
    canActivate():
     
    | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // Comprueba si el usuario está autenticado utilizando el servicio AuthService
      if (!this.authservice.IsLogged()){ 
        this.debeIniciar(); // Muestra una alerta si el usuario no está autenticado
        return false; // No se permite el acceso a la ruta
      }
    return true; // Permite el acceso a la ruta si el usuario está autenticado
  }

  async debeIniciar() {
    // Muestra una alerta al usuario informando que debe iniciar sesión
    const alert = await this.alertController.create({
      header: 'Acceso denegado',
      message: 'Debe iniciar sesión',
      buttons: [{
        text: 'OK',
        handler: () => {
          // Redirige al usuario a la página de inicio de sesión (login)
          this.router.navigate(['/login']); // Ajusta la ruta según tu configuración
        }
      }]
    });

    await alert.present();
  }
  
}
