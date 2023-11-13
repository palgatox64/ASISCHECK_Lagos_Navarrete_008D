import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {

  role: string = '';
  asignaturas: any[] = [];
  asignaturasLoaded: boolean = false;

  constructor( private menuController: MenuController, private authService: AuthService) {  }

  ngOnInit() {
    
    
  }

  ionViewWillEnter() {
    
    this.mostrarAsignaturas();
  }

  mostrarAsignaturas() {
 
    this.authService.getSubjects().subscribe(
      {
        next: asignaturas => {
          console.log('Asignaturas del usuario:', asignaturas);
          this.asignaturas = asignaturas; // Asigna las asignaturas a la propiedad del componente
          this.asignaturasLoaded = true; // Indica que ya se cargaron las asignaturas
        },
        error: err => {
          console.error('Error al obtener asignaturas:', err);
        }
      }
    );
  }

  mostrarMenu(){
    this.menuController.open('first');
  }

}
