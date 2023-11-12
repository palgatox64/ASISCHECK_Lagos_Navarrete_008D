import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
export class AppComponent implements OnInit {

  isAuthenticated: boolean;
  docenteComponentes: Componente[] = [];
  estudianteComponentes: Componente[] = [];

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

  ionViewWillEnter() {
    this.actualizarComponentes();
  }

  public verificarOpciones() {
    this.docenteComponentes = [];
    this.estudianteComponentes = [];

    if (this.isAuthenticated) {
      // Si el usuario está autenticado, muestra "Home", "Recursos" y "Cerrar sesión" al menú
      this.estudianteComponentes.push(
        { name: 'Home', icon: 'home-outline', redirecTo: '/home' },
        { name: 'Recursos', icon: 'search-outline', redirecTo: '/recursos' },
        { name: 'Información', icon: 'information-circle-outline', redirecTo: '/info'},
        { name: 'Cerrar sesión', icon: 'log-out-outline', redirecTo: '/login', action: () => this.cerrarSesion() }
      );

      this.isDocente().subscribe((esDocente) => {
        if (esDocente) {
          this.docenteComponentes.push({ name: 'Asignaturas', icon: 'book-outline', redirecTo: '/asignaturas' });
        } 
      });
    } else {
      // Si el usuario no está autenticado, muestra "Iniciar sesión", "Crear cuenta" e "Información" al menú
      this.estudianteComponentes.push(
        { name: 'Iniciar sesión', icon: 'log-in-outline', redirecTo: '/login' },
        { name: 'Crear cuenta', icon: 'person-add-outline', redirecTo: '/register' },
        { name: 'Información', icon: 'information-circle-outline', redirecTo: '/info' }
      );
    }
  }

  cerrarSesion() {
    this.authService.logout();
  }

  isDocente(): Observable<boolean> {
    return this.authService.getUserRole().pipe(
      map(role => role === 'Docente'),
      startWith(false) // Emite false al principio si aún no se ha completado el observable
    );
  }

  actualizarComponentes() {
    this.verificarOpciones();
  }

}
