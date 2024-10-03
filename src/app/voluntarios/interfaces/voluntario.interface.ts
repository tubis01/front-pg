export interface HateoasResponse<T> {
  _embedded: Embedded;
  _links:    HetoasReponseLinks;
  page:      Page;
}

export interface Embedded {
  datosDetalleVoluntarioList: DatosDetalleVoluntarioList[];
}

export interface DatosDetalleVoluntarioList {
  id:              number;
  nombre:          string;
  apellido:        string;
  genero:          string;
  correo:          string;
  telefono:        string;
  fechaNacimiento: Date;
  comentarios:     null;
  _links:          DatosDetalleVoluntarioListLinks;
}

export interface DatosDetalleVoluntarioListLinks {
  self:     Self;
  eliminar: Self;
}

export interface Self {
  href: string;
}

export interface HetoasReponseLinks {
  self: Self;
}

export interface Page {
  size:          number;
  totalElements: number;
  totalPages:    number;
  number:        number;
}
