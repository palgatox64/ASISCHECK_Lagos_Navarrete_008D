import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
})
export class RecuperacionPage implements OnInit {

  cambiarContrasenaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.cambiarContrasenaForm = this.formBuilder.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.cambiarContrasenaForm.reset();
  }

  regresarALogin() {
    this.router.navigate(['/login']);
  }

  async submitForm() {
    if (this.cambiarContrasenaForm.valid) {
      // Aquí puedes realizar la lógica para cambiar la contraseña
      const nuevaContrasena = this.cambiarContrasenaForm.value.nuevaContrasena;
      // Lógica para cambiar la contraseña según tu implementación
      // ...

      // Mostrar un mensaje de éxito si la contraseña se cambió correctamente
      this.mostrarAlerta('Contraseña Cambiada', 'La contraseña se cambió con éxito.');
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

}
