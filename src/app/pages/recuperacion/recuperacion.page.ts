import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiCrudService } from 'src/app/services/api-crud.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
})
export class RecuperacionPage implements OnInit {

  cambiarContrasenaForm: FormGroup;
  token: string = '';

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private apiCrudService: ApiCrudService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.cambiarContrasenaForm = this.formBuilder.group({
      // Agrega el nuevo campo de correo electrónico al FormGroup
      correoElectronico: ['', [Validators.required, Validators.email]],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
    });
    
  }

  ngOnInit() {
    this.cambiarContrasenaForm.reset();
    this.getTokenFromUrl();
  }

  regresarALogin() {
    this.router.navigate(['/login']);
  }

  async submitForm() {
    if (this.cambiarContrasenaForm.valid) {
      const nuevaContrasena = this.cambiarContrasenaForm.value.nuevaContrasena;
      const confirmarContrasena = this.cambiarContrasenaForm.value.confirmarContrasena;
  
      if (nuevaContrasena === confirmarContrasena) {
        // Obtener el correo electrónico desde el token
        const email = this.authservice.obtenerEmailDesdeToken(this.token, this.cambiarContrasenaForm.value.correoElectronico);
  
        if (email) {
          // Llamar al servicio para cambiar la contraseña
          this.authservice.cambiarContrasena(email, nuevaContrasena).subscribe(
            () => {
              // Mostrar mensaje de éxito
              this.mostrarAlerta('Contraseña Cambiada', 'La contraseña se cambió con éxito.');
              // Redireccionar al login u otra página
              this.router.navigate(['/login']);
            },
            error => {
              console.error('Error al cambiar la contraseña:', error);
              this.mostrarAlerta('Error', 'Hubo un error al cambiar la contraseña. Por favor, inténtalo nuevamente.');
            }
          );
        } else {
          this.mostrarAlerta('Error', 'El correo ingresado no coincide con la solicitud.');
        }
      } else {
        this.mostrarAlerta('Error', 'Las contraseñas no coinciden. Por favor, verifica.');
      }
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  getTokenFromUrl() {
    let token: string | null = null;
  
    this.route.queryParams.subscribe(params => {
      token = params['token'];
      console.log('Token:', token);
      if (!token) {
        // Manejar la ausencia de token en la URL, por ejemplo, redireccionar a una página de error
        this.mostrarAlerta('Error', 'Token no válido. Por favor, verifica el enlace.');
      } else {
        // Asignar el token a la propiedad token de la clase
        this.token = token;
      }
    });
  
    return token;
  }

  

}
