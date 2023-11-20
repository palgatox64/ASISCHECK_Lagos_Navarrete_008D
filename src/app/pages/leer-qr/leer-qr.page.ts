import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { BarcodeScanner  } from '@capacitor-community/barcode-scanner';
import { ApiCrudService } from 'src/app/services/api-crud.service';	
import { Registros } from '../interfaces/interfaces';
import { AlertController } from '@ionic/angular';
import { response } from 'express';
import { error } from 'console';


@Component({
  selector: 'app-leer-qr',
  templateUrl: './leer-qr.page.html',
  styleUrls: ['./leer-qr.page.scss'],
})
export class LeerQrPage implements OnInit {
  
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

  ionViewWillEnter() {

  }



  mostrarMenu() {
    this.menuController.open('first');
  }

 
  

}
