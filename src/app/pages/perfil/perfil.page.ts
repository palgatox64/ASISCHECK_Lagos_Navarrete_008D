import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { ApiCrudService } from 'src/app/services/api-crud.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  // Variables para almacenar los valores
  id: string = '';
  nombre: string = '';
  usuario: string = '';
  correo: string = '';
  foto: string = '';

  modoEdicion: boolean = false;



  constructor(private menuController: MenuController, public alertController: AlertController,
              private loadingController: LoadingController, private apiCrudService: ApiCrudService) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.id = sessionStorage.getItem('id') || '';
    this.nombre = sessionStorage.getItem('name') || '';
    this.usuario = sessionStorage.getItem('username') || '';
    this.correo = sessionStorage.getItem('email') || '';
    this.foto = sessionStorage.getItem('profilePicture') || '';
  }

  mostrarMenu() {
    this.menuController.open('first');
  }

    // Método para actualizar la foto de perfil
    actualizarFotoPerfil() {
      // Lógica para actualizar la foto de perfil
    }

    // Método para actualizar el nombre, usuario y correo
  actualizarDatosUsuario() {
    const idUsuario = Number(this.id);
    const datosActualizados = {
      name: this.nombre,
      username: this.usuario,
      email: this.correo,
      profilePicture: this.foto
    };

    this.apiCrudService.ActualizarUsuario(idUsuario, datosActualizados).subscribe(
      async(usuarioActualizado) => {
        // Manejar la respuesta del servidor (usuarioActualizado)
        console.log('Usuario actualizado:', usuarioActualizado);
        // Puedes actualizar las variables locales si es necesario
        await this.cambiosGuardados();
        this.modoEdicion = !this.modoEdicion;
      },
      (error) => {
        // Manejar errores
        console.error('Error al actualizar usuario:', error);
      }
    );
  }

  async toggleModoEdicion() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 1500, // Ajusta la duración según tus necesidades
      spinner: 'crescent' 
    });
  
    await loading.present();
  
    // Simula una operación de carga
  
    // Cierra la ventana de carga después de un tiempo (simulado)
    setTimeout(() => {
      loading.dismiss();
  
      if (this.modoEdicion) {
        // Si el modo de edición está activo, llama a la función actualizarDatosUsuario
        this.actualizarDatosUsuario();
      } else {
        // Si el modo de edición no está activo, simplemente cambia el modo de edición
        this.modoEdicion = !this.modoEdicion;
      }
    }, 1500); // Ajusta el tiempo según tus necesidades
  }
  
  


  
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  async cambiosGuardados() {
    const alert = await this.alertController.create({
      header: 'Cambios guardados',
      message: 'Los cambios se han guardado correctamente',
      buttons: ['OK']
    });

    await alert.present();
  }

}
