import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap, map } from 'rxjs/operators';
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
        return this.validarRol(route.data['validarRol']); // Comprueba si el usuario tiene el rol requerido
      }
     
    return true; // Permite el acceso a la ruta si el usuario está autenticado
  }

  validarRol(rolRequerido: string): Observable<boolean | UrlTree> {
    return from(this.authservice.getUserRole()).pipe(
      switchMap(role => {
        if (role === rolRequerido) {
          return of(true);
        } else {
          this.accesoDenegado();
          return of(false);
        }
      })
    );
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
        text: 'OK'     
      }]
    });

    await alert.present();
  }
    
  
}
