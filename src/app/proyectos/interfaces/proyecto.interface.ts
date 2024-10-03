export interface HateoasResponse <T>{
  _embedded: Embedded;
  _links:    HateoasResponseLinks;
  page:      Page;
}

export interface Embedded {
  datosDetalleProyectoList: DatosDetalleProyectoList[];
}

export interface DatosDetalleProyectoList {
  id:          number;
  nombre:      string;
  descripcion: string;
  fechaInicio: Date;
  estado:      string;
  fechaFin:    Date;
  _links:      DatosDetalleProyectoListLinks;
}

export interface DatosDetalleProyectoListLinks {
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
