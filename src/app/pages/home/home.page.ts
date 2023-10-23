import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  constructor(private menuController: MenuController, private authservice: AuthService) { 
  }

  ngOnInit() {



  }


  mostrarMenu(){
    this.menuController.open('first');
  }

  get loggedUserName(): string | null {
    return this.authservice.getLoggedUserName();
  }

}
