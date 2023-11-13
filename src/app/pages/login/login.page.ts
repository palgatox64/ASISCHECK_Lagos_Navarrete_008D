import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'; // Importa el componente AlertController
import { MenuController } from '@ionic/angular';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  Form,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

import * as bcrypt from 'bcryptjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userdata: any;

  usuario = {
    id: 0,
    name: '',
    role: '',
    username: '',
    email: '',
    password: '',
    subject: [],
    profilePicture: '',
    isactive: true,
  };

  loginForm: FormGroup;

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    public alertController: AlertController,
    private menuController: MenuController,
    private router: Router,
    private authservice: AuthService,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) {

    // Crea un formulario con validadores
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit() {
    console.log('formulario limpiado');
    this.loginForm.reset();
  }

  mostrarMenu() {
    this.menuController.open('first');
  }

  submitForm() {
    if (this.loginForm.valid) {
      this.authservice
        .GetUserById(this.loginForm.value.usuario)
        .subscribe(async (resp) => {
          // Realiza una solicitud para obtener datos de usuario
          this.userdata = resp;
          console.log(this.userdata);

          if (this.userdata.length > 0) {
            //si cumple la condición el objeto trae datos
            this.usuario = {
              //userdata llega en formato de arreglo
              id: this.userdata[0].id,
              name: this.userdata[0].name,
              role: this.userdata[0].role,
              username: this.userdata[0].username,
              email: this.userdata[0].email,
              subject: this.userdata[0].subject,
              password: this.userdata[0].password,
              profilePicture: this.userdata[0].profilePicture,
              isactive: this.userdata[0].isactive,
            };

             // Utiliza bcryptjs para comparar contraseñas
            const passwordMatch = await bcrypt.compare(
              this.loginForm.value.contrasena,
              this.usuario.password
            );



            if (passwordMatch) {
              console.log('Usuario autenticado');
              sessionStorage.setItem('id', this.usuario.id.toString());
              sessionStorage.setItem('name', this.usuario.name);
              sessionStorage.setItem('email', this.usuario.email);
              sessionStorage.setItem('username', this.usuario.username);
              sessionStorage.setItem('password', this.usuario.password);
              sessionStorage.setItem('userrole', this.usuario.role);
              sessionStorage.setItem('subject', JSON.stringify(this.usuario.subject));
              sessionStorage.setItem('profilePicture', this.usuario.profilePicture);
              sessionStorage.setItem('ingresado', 'true');
              this.showToast('Sesión Iniciada');
              this.authservice.setLoginStatus(true);
              this.authservice.setLoggedUserName(this.usuario.username);
              this.router.navigate(['/home']);
            } else {
              this.noCoincidePassword(); // Muestra un error si la contraseña no coincide
            } 
          } else {
            this.noExisteUsuario(); // Muestra un error si el usuario no existe
            this.loginForm.reset();
          }
        });
    }
  }

  ionViewWillEnter() {
    //restablece el formulario cuando se carga la página
    this.loginForm.reset();
  }

  //Muestra un mensaje emergente en la parte inferior de la pantalla con parámetro msg
  async showToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
    });
    toast.present();
  }

  //Muestra una alerta que indica que el usuario no existe
  async noExisteUsuario() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'El usuario no existe',
      buttons: ['OK'],
    });
    await alert.present();
  }

  //Muestra una alerta que indica que la contraseña no coincide
  async noCoincidePassword() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Las contraseñas no coinciden',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
