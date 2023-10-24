import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

// Define una interfaz llamada "Componente" para representar los elementos del menú

interface Componente {
  name: string; // Nombre del componente
  icon: string; // Icono asociado
  redirecTo: string; // Ruta de redirección al hacer clic en el componente
  action?: () => void; // Opcionalmente, una función a ejecutar al hacer clic
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  isAuthenticated: boolean; // Variable para verificar si el usuario está autenticado


  // Arreglo de objetos que representan los elementos del menú
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
    // Verifica si el usuario está autenticado cuando se carga la aplicación
    this.isAuthenticated = this.authService.IsLogged();
    this.verificarOpciones();
  }

  ngOnInit() {
    // Suscribe y escucha cambios en el estado de autenticación del usuario
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
      this.verificarOpciones();
    });
  }

  verificarOpciones(){
    // Verifica si el usuario está autenticado y agrega el ítem "Home" no está presente
    if (this.authService.IsLogged() && !this.componentes.some(item => item.name === 'Home') ) {

      // Si el usuario está autenticado, muestra "Home" , "Cerrar sesión , asignaturas y recursos" al menú
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
      // Si el usuario no está autenticado, esconde asignaturas, recursos, home y cerrar sesión
      this.componentes = this.componentes.filter((item) => item.name !== 'Home' && item.name !== 'Asignaturas' && item.name !== 'Recursos'  && item.name !== 'Cerrar sesión');
      if (!this.componentes.some((item) => item.name === 'Iniciar sesión')) {

        // Si el usuario no está autenticado, muestra "Iniciar sesión" y "Crear cuenta" al menú
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
    // Llama a la función de cierre de sesión del servicio de autenticación
    this.authService.logout(); 

  }

}
