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
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';




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
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private httpclient: HttpClient
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

  async submitForm() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Iniciando sesión...',
        translucent: true,
        backdropDismiss: false,
        duration: 5000, // Duración en milisegundos (en este caso, 5 segundos)
      });
  
      try {
        await loading.present(); // Presenta la pantalla de carga antes de la solicitud
  
        const resp = await this.authservice.GetUserById(this.loginForm.value.usuario).toPromise();
  
        // Realiza una solicitud para obtener datos de usuario
        this.userdata = resp;
        console.log(this.userdata);
  
        if (this.userdata.length > 0) {
          // Si cumple la condición, el objeto trae datos
          this.usuario = {
            // UserData llega en formato de arreglo
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
      } catch (error) {
        console.error('Error:', error);
      } finally {
        await loading.dismiss(); // Siempre cierra la pantalla de carga, incluso en caso de error
      }
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

  async olvidarContrasena() {
    const alert = await this.alertController.create({
      header: 'Recuperar Contraseña',
      message: 'Ingrese su dirección de correo electrónico para recibir un enlace de recuperación.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Correo Electrónico'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Enviar',
          handler: async (data) => {
            console.log('Verificando si el correo electrónico está registrado...');
            this.authservice.isEmailRegistered(data.email).subscribe(isEmailRegistered => {
              console.log('Resultado de la verificación:', isEmailRegistered);
  
              if (isEmailRegistered) {
                console.log('Enviando correo de recuperación a:', data.email);
  
                // Realiza una solicitud HTTP al servidor para enviar el correo
                this.httpclient.post('https://email.boukencraft.com/enviar-correo', {
                  destinatario: data.email,
                  asunto: 'Recuperación de Contraseña',
                  contenido: 'Haz clic en el enlace para restablecer tu contraseña.'
                }).subscribe(response => {
                  console.log('Respuesta del servidor:', response);
                  this.mostrarAlerta('Correo Electrónico Enviado', 'Se ha enviado un correo electrónico a la dirección ingresada con un enlace para restablecer su contraseña.');
                }, error => {
                  console.error('Error al enviar la solicitud HTTP:', error);
                  this.mostrarAlerta('Error', 'Error al enviar el correo electrónico');
                });
  
              } else {
                console.log('El correo electrónico no está registrado.');
                this.mostrarAlerta('Correo Electrónico no registrado', 'El correo electrónico ingresado no está registrado en nuestro sistema.');
              }
            });
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
  
    await alert.present();
  }

}
