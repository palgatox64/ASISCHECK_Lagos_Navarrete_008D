import { Component } from '@angular/core';

interface Componente {
  name: string;
  icon: string;
  redirecTo: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  componentes: Componente[] = [
    {
      name: 'Home',
      icon: 'home-outline',
      redirecTo: '/home'
    },
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
    },
  ]
  constructor() {}
}
