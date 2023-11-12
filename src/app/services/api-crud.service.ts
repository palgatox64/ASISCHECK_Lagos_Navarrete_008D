import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../pages/interfaces/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiCrudService {

  constructor(private httpclient:HttpClient) { }

  // Método para obtener todos los usuarios.
  // Devuelve un observable de tipo `Users[]`.
  ObtenerUsuarios(): Observable<Users[]> {
    return this.httpclient.get<Users[]>(`${environment.apiUrl}/usuarios`);
  }

  // Método para crear un nuevo usuario.
  // Toma un objeto `newUsuario` de tipo `Users` y devuelve un observable de tipo `Users`.
  CrearUsuario(newUsuario: Users): Observable<Users>{
  // Realiza una solicitud POST para crear un usuario en la URL definida en `environment.apiUrl`.
  // El nuevo usuario se pasa como el cuerpo de la solicitud.
    return this.httpclient.post<Users>(`${environment.apiUrl}/usuarios`, newUsuario);
  }

  

}
