import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ApiCrudService } from 'src/app/services/api-crud.service';
import { QrCodes } from '../interfaces/interfaces';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { LoadingController } from '@ionic/angular';



@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
})
export class GenerarQrPage implements OnInit {

  public mensaje: string = '';
  public mostrarQR: boolean = false;

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

  constructor(private menuController: MenuController, private apiCrud: ApiCrudService,
             private loadingController: LoadingController, private alertController: AlertController, private router: Router) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.nombreUsuario = sessionStorage.getItem('name') || '';
  }

  ionViewWillLeave() { 
    this.ocultarQR();
  }

  async generarQr() {
    const loading = await this.loadingController.create({
      message: 'Generando QR...',
      translucent: true,
      backdropDismiss: false,
      duration: 5000,
    });

    try {
      await loading.present(); // Presenta la pantalla de carga antes de la solicitud

      this.newQrCode.name = this.nombreUsuario;
      this.newQrCode.dateTime = new Date();
      const asignaturaQrString = sessionStorage.getItem('asignaturaQr');

      if (asignaturaQrString) {
        const asignaturaQr = JSON.parse(asignaturaQrString);
        if (asignaturaQr && asignaturaQr.name) {
          this.newQrCode.subject = asignaturaQr.name;
        }
      }

      const uniqueId = uuidv4();

      this.apiCrud.CrearQrCode(this.newQrCode).subscribe(
        (response) => {
          console.log('QR creado exitosamente', response);
          this.data.texto = response.subject + '_' + uniqueId;
          this.mensaje = this.data.texto;
          this.mostrarQR = true;
          this.mostrarMensaje('QR creado exitosamente', 'Se ha almacenado el QR');
        },
        (error) => {
          console.error('Error al crear el QR', error);
          this.mostrarMensaje('Error', 'Hubo un error al crear el QR');
        }
      );
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await loading.dismiss(); // Siempre cierra la pantalla de carga, incluso en caso de error
    }
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

  private ocultarQR() {
    this.mostrarQR = false;
  }


}
