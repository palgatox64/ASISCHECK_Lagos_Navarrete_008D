import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
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
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
     
    | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // Comprueba si el usuario está autenticado utilizando el servicio AuthService
      if (!this.authservice.IsLogged()){ 
        this.debeIniciar(); // Muestra una alerta si el usuario no está autenticado
        return false; // No se permite el acceso a la ruta
      }
      
      if (route.data && route.data['validarRol']) {
        return this.validarRol(route.data['validarRol']);
      }
  
      return true;
    }

    private validarRol(rolRequerido: string): boolean | UrlTree {
      // Obtén el rol del usuario desde sessionStorage
      const role = this.authservice.getLoggedUserRole();
  
      // Verifica si el usuario tiene el rol requerido
      if (role === rolRequerido) {
        return true;
      } else {
        this.accesoDenegado(); // Puedes redirigir a una página de acceso denegado o cambiar la URL según tus necesidades
        return false;
      }
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

  async accesoDenegado() {
    const alert = await this.alertController.create({
      header: 'Acceso denegado',
      message: 'No tiene permiso para acceder a esta página',
      buttons: [{
        text: 'OK',
        handler: () => {
          // Redirige al usuario a la página de inicio de sesión (login)
          this.router.navigate(['/info']); // Ajusta la ruta según tu configuración
        }
      }]
    });

    await alert.present();
  }
  
}
