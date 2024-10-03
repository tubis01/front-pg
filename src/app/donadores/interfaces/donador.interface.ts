export interface HateoasResponse<T> {
  _embedded: Embedded;
  _links:    HateoasResponseLinks;
  page:      Page;


}

export interface Embedded {
  datosDetalleDonadorList: DatosDetalleDonadorList[];
}

export interface DatosDetalleDonadorList {
  id:          number;
  nombre:      string;
  apellido:    string;
  genero:      Genero;
  correo:      string;
  telefono:    string;
  fechaNacimiento: Date;
  comentarios: string;
  _links:      DatosDetalleDonadorListLinks;
}

export enum Genero {
  Femenino = "Femenino",
  Masculino = "Masculino",
}


export interface DatosDetalleDonadorListLinks {
  self:     Self;
  eliminar: Self;
}

export interface Self {
  href: string;
}

export interface HateoasResponseLinks {
  self: Self;
}

export interface Page {
  size:          number;
  totalElements: number;
  totalPages:    number;
  number:        number;
}
