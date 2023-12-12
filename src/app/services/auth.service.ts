import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Users } from '../pages/interfaces/interfaces';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';  // Agrega esta línea
import * as bcrypt from 'bcryptjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private secretKey = 'teamasischeck';

  private isLoggedInSubject = new Subject<boolean>();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Almacena el nombre de usuario autenticado
  private loggedUsername: string | null = null;

  
  // Método para actualizar el estado de autenticación
  setLoginStatus(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  // Método para actualizar el estado de autenticación

  constructor(private httpclient: HttpClient, private router: Router) { 
  }

  // Obtener información de usuario por ID
  GetUserById(codigo: any):Observable<Users>{
    return this.httpclient.get<Users>(`${environment.apiUrl}/usuarios/?username=${codigo}`);
  }

  getSubjects(): Observable<string[]> {
    const username = this.getLoggedUserName();
    if (username) {
      return this.httpclient.get<Users[]>(`${environment.apiUrl}/usuarios/?username=${username}`).pipe(
        map(users => {
          const user = users[0]; 
          console.log('Respuesta del servidor:', user); 
          return user?.subject || [];
        })
      );
    } else {
      return of([]); // Retorna un observable vacío si no hay un nombre de usuario autenticado
    }
  }


  getLoggedUserRole(): string | null {
    return sessionStorage.getItem('userrole');
  }



  // Método para establecer el nombre del usuario cuando inicia sesión
  setLoggedUserName(username: string | null) {
    this.loggedUsername = username;
  }

  // Obtener el nombre de usuario autenticado
  getLoggedUserName(): string | null {
    return this.loggedUsername;
  }

// Verificar si el usuario está autenticado
  IsLogged(){
    return sessionStorage.getItem('username')!=null;
  }

 // Verificar si el usuario no está autenticado
  IsNotLogged() {
    return !this.IsLogged(); // Devuelve true si el usuario no está autenticado, de lo contrario, devuelve false.
  }

  // Verifica si el correo electrónico existe en el JSON de usuarios
  isEmailRegistered(email: string): Observable<boolean> {
    return this.httpclient.get<Users[]>(`${environment.apiUrl}/usuarios/?email=${email}`).pipe(
      map(users => {
        const isRegistered = users.some(user => user.email === email);
        console.log(`Correo electrónico ${email} registrado: ${isRegistered}`);
        return isRegistered;
      })
    );
  }

  generateToken(email: string): string {
    // Concatena el correo electrónico con la clave secreta y realiza el hash
    const tokenData = email + this.secretKey;
    const hashedToken = bcrypt.hashSync(tokenData, 10);

    return hashedToken;
  }

  logout() {
    // Elimina los datos de la sesión en sessionStorage
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('username'); 
    sessionStorage.removeItem('userrole');
    sessionStorage.removeItem('ingresado');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('subject');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('profilePicture');
    sessionStorage.removeItem('asignaturaQr');
  }

}
