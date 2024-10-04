export interface HateoasResponse<T> {
  _embedded?: Embedded<T>;
  _links: Links;
  page: Page;
}

export interface Embedded<T> {
  datosDetalleUsuarioList: Usuario[];
}

export interface Usuario {
  id: number;
  email: string;
  usuario: string;
  rol: string;
}

export interface Links {
  first: First;
  self: First;
  next: First;
  last: First;
  prev: First;
}

export interface First {
  href: string;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
