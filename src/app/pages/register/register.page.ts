import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
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
    username: '',
    email: '',
    password: '',
    profilePicture: 'assets/img/unknown.jpg',
  }

  asignaturas = [
    { id: 1, name: 'PROGRAMACION DE APLICACIONES MOVILES', periodo: '2023-2', horario: 'Lunes 8:00 - 10:00 | Jueves 8:00 - 10:00', image: 'assets/img/appmovil.png'},
    { id: 2, name: 'DESARROLLO FULL STACK', periodo: '2023-2', horario: 'Martes 8:00 - 10:00 | Viernes 8:00 - 10:00', image: 'assets/img/fullstack.png'},
    { id: 3, name: 'PROGRAMACION DE BASE DE DATOS', periodo: '2023-2', horario: 'Miercoles 8:00 - 10:00', image: 'assets/img/database.png'},
  ];



  constructor(public alertController: AlertController, private menuController: MenuController, 
              private formBuilder: FormBuilder, private router: Router, private apiCrud: ApiCrudService) { 

    this.registroForm = this.formBuilder.group({ // Define el formulario con campos y validadores
      nombre: ['', Validators.required],
      rol: ['', Validators.required],
      subject: [''],
      usuario: ['', [Validators.required, Validators.minLength(6)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', [Validators.required]],
    });

    // Escucha los cambios en el campo "rol" y ajusta dinámicamente el campo "subject"
    this.registroForm.get('rol')?.valueChanges.subscribe((rol) => {
      if (rol === 'Docente') {
        this.registroForm.get('subject')?.setValidators([Validators.required]);
      } else {
        this.registroForm.get('subject')?.clearValidators();
      }

      this.registroForm.get('subject')?.updateValueAndValidity();
    });

  }

  ngOnInit() {
  }

  mostrarMenu() {
    this.menuController.open('first');
  }

  async submitForm() {
    if (this.registroForm.valid) {
      // Accede a los valores del formulario
      const contrasena = this.registroForm.get('contrasena')?.value;
      const confirmarContrasena = this.registroForm.get('confirmarContrasena')?.value;
      const username = this.registroForm.get('usuario')?.value; // Agrega esta línea
      const email = this.registroForm.get('correo')?.value; // Agrega esta línea
      
  
      // Realiza las validaciones adicionales, como comparar contraseñas
      if (contrasena !== confirmarContrasena) {
        // Las contraseñas no coinciden, muestra un mensaje de error
        
        console.log('Las contraseñas no coinciden');
        this.noCoincidePassword();
        
      } else {
        // Verifica si el usuario ya existe
        const usuarioExistente = await this.verificarUsuarioExistente(username, email);

        if (usuarioExistente.existe) {
          // El usuario ya existe, muestra un mensaje de error específico
          if (usuarioExistente.tipo === 'usuario') {
            this.usuarioExistenteAlert();
          } else if (usuarioExistente.tipo === 'correo') {
            this.correoExistenteAlert();
          }
        } else {
          // Envía el formulario si todo está en orden
          console.log('Formulario válido. Enviar datos al servidor.');
          this.newUsuario.subject = this.registroForm.get('subject')?.value;
          this.registroExitoso();
          this.crearUsuario();
        }
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

  async verificarUsuarioExistente(username: string, email: string): Promise<{ existe: boolean; tipo?: 'usuario' | 'correo' }> {
    try {
      const usuarios = await this.apiCrud.ObtenerUsuarios().toPromise();
  
      if (usuarios) {
        const usuarioExistente = usuarios.some((usuario) => usuario.username === username);
        const correoExistente = usuarios.some((usuario) => usuario.email === email);
  
        if (usuarioExistente || correoExistente) {
          return { existe: true, tipo: usuarioExistente ? 'usuario' : 'correo' };
        } else {
          return { existe: false };
        }
      } else {
        console.error('La lista de usuarios es undefined');
        return { existe: false };
      }
    } catch (error) {
      console.error('Error al obtener la lista de usuarios', error);
      return { existe: false };
    }
  }
  crearUsuario() {
    // Llama al servicio para crear un nuevo usuario
    this.apiCrud.CrearUsuario(this.newUsuario).subscribe();
  }

  async usuarioExistenteAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'El usuario ya está registrado. Por favor, elija otro.',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  async correoExistenteAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'El correo electrónico ya está registrado. Por favor, elija otro.',
      buttons: ['OK']
    });
  
    await alert.present();
  }
  

}
