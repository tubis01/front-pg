export interface HateoasResponse <T> {
  _embedded: Embedded;
  _links:    HateoasResponseLinks;
  page:      Page;
}

export interface Embedded {
  datosDetalleResponsableList: DatosDetalleResponsableList[];
}

export interface DatosDetalleResponsableList {
  id:              number;
  nombre:          string;
  apellido:        string;
  genero:          string;
  fechaNacimiento: Date;
  correo:          string;
  telefono:        string;
  _links:          DatosDetalleResponsableListLinks;
}

export interface DatosDetalleResponsableListLinks {
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
