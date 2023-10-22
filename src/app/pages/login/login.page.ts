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
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {}

  mostrarMenu() {
    this.menuController.open('first');
  }

  submitForm() {
    if (this.loginForm.valid) {
      this.authservice
        .GetUserById(this.loginForm.value.usuario)
        .subscribe((resp) => {
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
              password: this.userdata[0].password,
              isactive: this.userdata[0].isactive,
            };

            if (this.usuario.password === this.loginForm.value.contrasena) {
              console.log('Usuario autenticado');

              this.showToast('Sesión Iniciada');
              this.router.navigate(['/home']);
            } else {
              this.noCoincidePassword();
            } 
          } else {
            this.noExisteUsuario();
            this.loginForm.reset();
          }
        });
    }
  }

  async showToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
    });
    toast.present();
  }

  async noExisteUsuario() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'El usuario no existe',
      buttons: ['OK'],
    });
    await alert.present();
  }
  async noCoincidePassword() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Las contraseñas no coinciden',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
