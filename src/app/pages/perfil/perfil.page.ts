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
  rol: string = '';
  correo: string = '';
  foto: string = '';
  password: string = '';
  asignatura: string[] = [];

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
    this.asignatura = JSON.parse(sessionStorage.getItem('subject') || '[]');
    this.rol = sessionStorage.getItem('userrole') || '';
    this.password = sessionStorage.getItem('password') || '';
  }

  mostrarMenu() {
    this.menuController.open('first');
  }

 
  // async actualizarFotoPerfil(fileInput: FileInput) {
  //   const loading = await this.loadingController.create({
  //     message: 'Cargando...',
  //     duration: 1500,
  //     spinner: 'crescent',
  //   });
  
  //   await loading.present();
  
  //   // Simula una operación de carga
  
  //   // Cierra la ventana de carga después de un tiempo (simulado)
  //   setTimeout(async () => {
  //     loading.dismiss();
  
  //     const idUsuario = Number(this.id);
  
  //     // Verifica si se seleccionó un archivo
  //     if (fileInput.files.length > 0) {
  //       const archivo = fileInput.files[0].file;
  
  //       // Llama al servicio para subir la imagen y obtener la URL
  //       this.apiCrudService.SubirImagen(archivo).subscribe(
  //         async (response) => {
  //           const nuevaFoto = response.imageUrl;
  
  //           // Luego, puedes usar la URL de la imagen para actualizar el perfil del usuario
  //           const datosActualizados = { profilePicture: nuevaFoto };
  //           this.apiCrudService.ActualizarUsuario(idUsuario, datosActualizados).subscribe(
  //             async (usuarioActualizado) => {
  //               console.log('Foto de perfil actualizada:', usuarioActualizado);
  //               sessionStorage.setItem('profilePicture', nuevaFoto);
  //               await this.cambiosGuardados();
  //             },
  //             (error) => {
  //               console.error('Error al actualizar la foto de perfil:', error);
  //             }
  //           );
  //         },
  //         (error) => {
  //           console.error('Error al subir la imagen:', error);
  //         }
  //       );
  //     } else {
  //       // Mostrar un mensaje de error si no se seleccionó ningún archivo
  //       this.mostrarAlerta('Error', 'Selecciona una imagen para actualizar tu foto de perfil.');
  //     }
  //   }, 1500);
  // }

    // Método para actualizar el nombre, usuario y correo
  actualizarDatosUsuario() {
    const idUsuario = Number(this.id);
    const datosActualizados = {
      name: this.nombre,
      username: this.usuario,
      role: this.rol,
      password: this.password,
      email: this.correo,
      subject: this.asignatura,
      profilePicture: this.foto
    };

    this.apiCrudService.ActualizarUsuario(idUsuario, datosActualizados).subscribe(
      async(usuarioActualizado) => {
        // Manejar la respuesta del servidor (usuarioActualizado)
        console.log('Usuario actualizado:', usuarioActualizado);
        // Puedes actualizar las variables locales si es necesario
        sessionStorage.setItem('name', this.nombre);
        sessionStorage.setItem('username', this.usuario);
        sessionStorage.setItem('userrole', this.rol);
        sessionStorage.setItem('password', this.password);
        sessionStorage.setItem('email', this.correo);
        sessionStorage.setItem('subject', JSON.stringify(this.asignatura));
        sessionStorage.setItem('profilePicture', this.foto);
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
