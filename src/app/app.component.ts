import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

interface Componente {
  name: string;
  icon: string;
  redirecTo: string;
  action?: () => void;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  isAuthenticated: boolean;

  componentes: Componente[] = [

    {
      name: 'Iniciar sesión',
      icon: 'log-in-outline',
      redirecTo: '/login'
    },
    {
      name: 'Crear cuenta',
      icon: 'person-add-outline',
      redirecTo: '/register'
    },
    {
      name: 'Información',
      icon: 'information-circle-outline',
      redirecTo: '/info'
    }
  ];



  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.IsLogged();
    this.verificarOpciones();
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
      this.verificarOpciones();
    });
  }

  verificarOpciones(){
    // Verifica si el usuario está autenticado y agrega el ítem "Home" no está presente
    if (this.authService.IsLogged() && !this.componentes.some(item => item.name === 'Home') ) {

      // Si el usuario está autenticado, eliminar "Iniciar sesión" y "Crear cuenta" del menú
      this.componentes = this.componentes.filter(
        (item) => item.name !== 'Iniciar sesión' && item.name !== 'Crear cuenta'
      );
      
      this.componentes.unshift({
        name: 'Recursos',
        icon: 'search-outline',
        redirecTo: '/recursos'
      });

      this.componentes.unshift({
        name: 'Asignaturas',
        icon: 'book-outline',
        redirecTo: '/asignaturas'
      });

      this.componentes.unshift({
        name: 'Home',
        icon: 'home-outline',
        redirecTo: '/home'
      });

      this.componentes.push({
        name: 'Cerrar sesión',
        icon: 'log-out-outline',
        redirecTo: '/login',
        action: () => this.cerrarSesion()
      });

    } else if (!this.authService.IsLogged()) {
      // Si el usuario no está autenticado, elimina "Home" y "Cerrar sesión" del menú
      this.componentes = this.componentes.filter((item) => item.name !== 'Home' && item.name !== 'Asignaturas' && item.name !== 'Recursos'  && item.name !== 'Cerrar sesión');
      if (!this.componentes.some((item) => item.name === 'Iniciar sesión')) {

        this.componentes.unshift({
          name: 'Crear cuenta',
          icon: 'person-add-outline',
          redirecTo: '/register'
        });

        this.componentes.unshift({
          name: 'Iniciar sesión',
          icon: 'log-in-outline',
          redirecTo: '/login'
        });
  
      }
    }
  }

  cerrarSesion() {

    this.authService.logout(); 

  }

}
