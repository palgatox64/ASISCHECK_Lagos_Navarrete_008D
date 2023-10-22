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
      if (!this.authservice.IsLogged()){
        this.debeIniciar();
        return false;
      }
    return true;
  }

  async debeIniciar() {
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
