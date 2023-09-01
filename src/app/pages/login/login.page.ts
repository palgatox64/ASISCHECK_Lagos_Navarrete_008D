import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = ''; // Variable para el usuario
  password: string = ''; // Variable para la contraseña

  autenticarLogin() {
    // Requiere agregar logica
  }

  ngOnInit() {
  }

}
