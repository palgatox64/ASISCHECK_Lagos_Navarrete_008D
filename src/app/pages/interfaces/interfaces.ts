// Esta interfaz Users se utiliza para definir una estructura o modelo de datos que representa las propiedades de un usuario en la aplicación. 
// En otras palabras, especifica la forma en que se deben estructurar los objetos de usuario en TypeScript. 



export interface Users {
  id: number;
  name: string;
  role: string;
  subject: string[];
  username: string;
  email: string;
  password: string;
}