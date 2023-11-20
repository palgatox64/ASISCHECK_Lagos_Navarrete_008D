import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ApiCrudService } from 'src/app/services/api-crud.service';
import { Registros } from '../interfaces/interfaces';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leer-qr',
  templateUrl: './leer-qr.page.html',
  styleUrls: ['./leer-qr.page.scss'],
})
export class LeerQrPage implements OnInit {
  result = '';
  scanActive = false;

  constructor(
    private menuController: MenuController,
    private apiCrud: ApiCrudService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    BarcodeScanner.prepare();
  }

  ngOnDestroy() {
    BarcodeScanner.stopScan();
  }

  mostrarMenu() {
    this.menuController.open('first');
  }

  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
      this.scanActive = true;
      const result = await BarcodeScanner.startScan();
      console.log(
        '🚀 ~ file: leer-qr.page.ts ~ line 45 ~ LeerQrPage ~ startScanner ~ result',
        result
      );
      if (result.hasContent) {
        this.result = result.content;
        this.scanActive = false;
        // Procesar y almacenar datos en la interfaz Registros
        const qrParts = result.content.split('_');
        const subject = qrParts[0]; // La asignatura se encuentra en la primera parte del contenido
        const uniqueId = qrParts[1]; // El ID único se encuentra en la segunda parte

        // Obtener otros datos del Session Storage
        const idEstudiante = sessionStorage.getItem('id') || '';
        const name = sessionStorage.getItem('name') || '';

        // Crear un nuevo registro
        const newRegistro: Registros = {
          id: 0,
          idEstudiante: idEstudiante,
          name: name,
          subject: subject,
          dateTime: new Date(),
        };

        // Llamar al servicio para crear el registro
        this.apiCrud.CrearRegistro(newRegistro).subscribe(
          (response) => {
            console.log('Registro creado exitosamente', response);
            // Mostrar la alerta de éxito al registrar el QR
            this.mostrarAlerta('Registro Exitoso', subject, uniqueId);

          },
          (error) => {
            console.error('Error al crear el registro', error);
          }
        );
      }
    }
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        const alert = await this.alertController.create({
          header: 'No hay permisos',
          message:
            'Por favor, permita el acceso de la cámara en la configuración de la aplicación.',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Abrir configuración',
              handler: () => {
                BarcodeScanner.openAppSettings();
                resolve(false);
              },
            },
          ],
        });

        await alert.present();
      } else {
        resolve(false);
      }
    });
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  async mostrarAlerta(header: string, materia: string, uuid: string) {
    const message = `${materia}  ${uuid} \nSe ha registrado el QR`;
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Navega a la página de inicio (home) al hacer clic en OK
            this.router.navigate(['/home']);
          },
        },
      ],
    });
  
    alert.onDidDismiss().then(() => {
      // opcionalmente, puede ejecutar código aquí cuando se cierra la alerta
    });
  
    await alert.present();
  }
}
