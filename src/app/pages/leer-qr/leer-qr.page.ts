import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ApiCrudService } from 'src/app/services/api-crud.service';	
import { Registros } from '../interfaces/interfaces';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';


@Component({
  selector: 'app-leer-qr',
  templateUrl: './leer-qr.page.html',
  styleUrls: ['./leer-qr.page.scss'],
})
export class LeerQrPage implements OnInit {

  result = '';
  scanActive = false;
  
  newRegistro: Registros = {
    id: 0,
    idEstudiante: '',
    name: '',
    subject: '',
    dateTime: new Date()
  };

  constructor(private menuController: MenuController, private apiCrud: ApiCrudService, private alertController: AlertController) { }

  ngOnInit() {
    
  }

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
      console.log("🚀 ~ file: leer-qr.page.ts ~ line 49 ~ LeerQrPage ~ startScanner ~ result", result);
      if (result.hasContent) {
      this.result = result.content;
      this.scanActive = false;
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
          message: 'Por favor, permita el acceso de la cámara en la configuración de la aplicación.',
          buttons: [{
            text: 'Cancelar',
            role: 'cancel'
          }, 
          {
            text: 'Abrir configuración',
            handler: () => {
              BarcodeScanner.openAppSettings();
              resolve(false);
            }
          }]
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

}
