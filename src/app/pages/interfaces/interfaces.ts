// Esta interfaz Users se utiliza para definir una estructura o modelo de datos que representa las propiedades de un usuario en la aplicación. 
// En otras palabras, especifica la forma en que se deben estructurar los objetos de usuario en TypeScript. 



export interface Users {
  id: number;
  name: string;
  role: string; // Rol del usuario docente o estudiante
  subject?: string[]; // Array de asignaturas
  username: string;
  email: string;
  password: string;
  profilePicture?: string; // Imagen de perfil
}

export interface QrCodes { 
  id: number;
  name: string; // Nombre del docente que genera el QR
  subject: string; // Nombre de la asignatura
  dateTime: Date; // Fecha y hora del sistema

}

export interface Registros {
  id: number;
  idEstudiante: string; // ID del estudiante
  name: string; // Nombre del estudiante
  subject: string; // Nombre de la asignatura
  dateTime: Date; // Fecha y hora del sistema
}

export interface Recursos {
  id: number;
  titulo: string;
  tipo: string;
  enlace: string;
  imagen: string;
}