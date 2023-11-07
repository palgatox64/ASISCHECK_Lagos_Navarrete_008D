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

  registroForm: FormGroup; // Define el formulario FormGroup

  newUsuario: Users = {
    id: 0,
    name: '',
    role: '',
    subject: [],
    username: '',
    email: '',
    password: '',
  }

  asignaturas = [
    { id: 1, name: 'PROGRAMACION DE APLICACIONES MOVILES', periodo: '2023-2', horario: 'Lunes 8:00 - 10:00 | Jueves 8:00 - 10:00'},
    { id: 2, name: 'DESARROLLO FULL STACK', periodo: '2023-2', horario: 'Martes 8:00 - 10:00 | Viernes 8:00 - 10:00'},
    { id: 3, name: 'PROGRAMACION DE BASE DE DATOS', periodo: '2023-2', horario: 'Miercoles 8:00 - 10:00' },

  ];



  constructor(public alertController: AlertController, private menuController: MenuController, 
              private formBuilder: FormBuilder, private router: Router, private apiCrud: ApiCrudService) { 

    this.registroForm = this.formBuilder.group({ // Define el formulario con campos y validadores
      nombre: ['', Validators.required],
      rol: ['', Validators.required],
      subject: ['', Validators.required],
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

        this.newUsuario.subject = this.registroForm.get('subject')?.value;


        this.registroExitoso();
        this.crearUsuario();
      }
    }
  }

  async noCoincidePassword() {
     // Muestra una alerta si las contraseñas no coinciden
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
          // Redirige al usuario a la página de inicio de sesión (login) si el registro es exitoso
          this.router.navigate(['/login']); 
        }
      }]
    });

    await alert.present();
  }

  crearUsuario() {
    // Llama al servicio para crear un nuevo usuario
    this.apiCrud.CrearUsuario(this.newUsuario).subscribe();
  }
  

}
