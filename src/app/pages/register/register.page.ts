import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Users } from '../interfaces/interfaces';
import { ApiCrudService } from 'src/app/services/api-crud.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registroForm: FormGroup;

  newUsuario: Users = {
    id: 0,
    name: '',
    role: '',
    username: '',
    email: '',
    password: '',
    isactive: false
  }

  constructor(public alertController: AlertController, private menuController: MenuController, 
              private formBuilder: FormBuilder, private router: Router, private apiCrud: ApiCrudService) { 

    this.registroForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      rol: ['', Validators.required],
      usuario: ['', [Validators.required, Validators.minLength(6)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', [Validators.required]],
    });

  }

  ngOnInit() {
  }

  mostrarMenu() {
    this.menuController.open('first');
  }

  submitForm() {
    if (this.registroForm.valid) {
      // Accede a los valores del formulario
      const nombre = this.registroForm.get('nombre')?.value;
      const rol = this.registroForm.get('rol')?.value;
      const usuario = this.registroForm.get('usuario')?.value;
      const correo = this.registroForm.get('correo')?.value;
      const contrasena = this.registroForm.get('contrasena')?.value;
      const confirmarContrasena = this.registroForm.get('confirmarContrasena')?.value;
  
      // Realiza las validaciones adicionales, como comparar contraseñas
      if (contrasena !== confirmarContrasena) {
        // Las contraseñas no coinciden, muestra un mensaje de error
        
        console.log('Las contraseñas no coinciden');
        this.noCoincidePassword();
        
      } else {
        // Envía el formulario si todo está en orden
        console.log('Formulario válido. Enviar datos al servidor.');
        this.registroExitoso();
        this.crearUsuario();
      }
    }
  }

  async noCoincidePassword() {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden',
        buttons: ['OK']
      });

      await alert.present();
  }

  async registroExitoso() {
    const alert = await this.alertController.create({
      header: 'Registro exitoso',
      message: 'Se ha registrado correctamente',
      buttons: [{
        text: 'OK',
        handler: () => {
          // Redirige al usuario a la página de inicio de sesión (login)
          this.router.navigate(['/login']); // Ajusta la ruta según tu configuración
        }
      }]
    });

    await alert.present();
  }

  crearUsuario() {
    this.apiCrud.CrearUsuario(this.newUsuario).subscribe();
  }
  

}
