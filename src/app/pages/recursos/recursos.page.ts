import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.page.html',
  styleUrls: ['./recursos.page.scss'],
})
export class RecursosPage implements OnInit {

  constructor(private menuController: MenuController, private http: HttpClient) { }

  recursos: any[] = [];

  ngOnInit() {
   
  }

  ionViewWillEnter() {
    this.http.get('https://recursos.boukencraft.com/recursos').subscribe((data: any) => { // Obtiene y almacena los recursos desde una API

      this.recursos = data;
    });
  }

  mostrarMenu() {
    this.menuController.open('first');
  }


}
