import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ApiCrudService } from 'src/app/services/api-crud.service';
import { QrCodes } from '../interfaces/interfaces';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
})
export class GenerarQrPage implements OnInit {

  public mensaje: string = '';

  newQrCode: QrCodes = {
    id: 0,
    name: '',
    subject: '',
    dateTime: new Date()
  };

  nombreUsuario: any;

  data = {
    texto: '',
  }

  constructor(private menuController: MenuController, private apiCrud: ApiCrudService, private alertController: AlertController, private router: Router) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.nombreUsuario = sessionStorage.getItem('name') || '';
  }

  generarQr() {
    this.newQrCode.name = this.nombreUsuario;
    this.newQrCode.dateTime = new Date(); 
     // Recupera el objeto asignaturaQr del sessionStorage
     const asignaturaQrString = sessionStorage.getItem('asignaturaQr');

     if (asignaturaQrString) {
       // Parsea el objeto asignaturaQrString a un objeto JavaScript
       const asignaturaQr = JSON.parse(asignaturaQrString);
 
       // Verifica si la propiedad 'name' está presente antes de asignarla
       if (asignaturaQr && asignaturaQr.name) {
         this.newQrCode.subject = asignaturaQr.name;
       }
     }

    this.apiCrud.CrearQrCode(this.newQrCode).subscribe(
      (response) => {
        console.log('QR creado exitosamente', response);
        this.data.texto = response.subject;
        this.mensaje=this.data.texto;
        this.mostrarMensaje('QR creado exitosamente', 'Se ha almacenado el QR');
      },
      (error) => {
        console.error('Error al crear el QR', error);
        this.mostrarMensaje('Error', 'Hubo un error al crear el QR');
        // Maneja el error según tus necesidades
      }
    );

  }

  mostrarMenu() {
    this.menuController.open('first');
  }

  mostrarMensaje(header: string, message: string) {
    this.alertController.create({
      header: header,
      message: message,
      buttons: ['Ok']
    }).then(alert => alert.present());
  }

  volver() {
    this.router.navigate(['/asignaturas']);
  }

}
