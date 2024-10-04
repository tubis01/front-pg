
export interface HateoasResponse <T>{
  _embedded: Embedded <T>;
  _links:    Links;
  page:      Page;
}

export interface Embedded <T> {
  datosDetalleProyectoList: Proyecto[];
}

export interface Proyecto {
  id:          number;
  nombre:      string;
  descripcion: string;
  fechaInicio: Date;
  estado:      string;
  fechaFin:    Date;
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
