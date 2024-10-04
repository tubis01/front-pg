export interface HateoasResponse <T> {
  _embedded: Embedded<T>;
  _links:    Links;
  page:      Page;
}

export interface Embedded <T> {
  datosDetalleResponsableList: Responsable[];
}

export interface Responsable {
  id:              number;
  nombre:          string;
  apellido:        string;
  genero:          string;
  fechaNacimiento: Date;
  correo:          string;
  telefono:        string;
}


export interface Links {
  first: First;
  self:  First;
  next:  First;
  last:  First;
  prev:  First;
}

export interface First {
  href: string;
}


export interface Page {
  size:          number;
  totalElements: number;
  totalPages:    number;
  number:        number;
}
