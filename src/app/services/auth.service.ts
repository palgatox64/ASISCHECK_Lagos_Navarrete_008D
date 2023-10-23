import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Users } from '../pages/interfaces/interfaces';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new Subject<boolean>();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private loggedUsername: string | null = null;

  setLoginStatus(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  constructor(private httpclient: HttpClient, private router: Router) { 
  }

  GetUserById(codigo: any):Observable<Users>{
    return this.httpclient.get<Users>(`${environment.apiUrl}/usuarios/?username=${codigo}`);
  }


  // Método para establecer el nombre del usuario cuando inicia sesión
  setLoggedUserName(username: string | null) {
    this.loggedUsername = username;
  }

  getLoggedUserName(): string | null {
    return this.loggedUsername;
  }

  IsLogged(){
    return sessionStorage.getItem('username')!=null;
  }

  IsNotLogged() {
    return !this.IsLogged(); // Devuelve true si el usuario no está autenticado, de lo contrario, devuelve false.
  }
  
  logout() {
    // Elimina los datos de la sesión en sessionStorage
    sessionStorage.removeItem('username'); 
    sessionStorage.removeItem('userrole');
    sessionStorage.removeItem('ingresado');

  }

}
