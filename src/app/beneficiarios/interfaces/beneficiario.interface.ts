export interface HateoasResponse <T>{
  _embedded?: Embedded<T>;
  _links:    Links;
  page:      Page;
}

export interface Embedded<T> {
  datosDetalleBeneficiarioList: Beneficiario[];
}

export interface Beneficiario {
  id:                    number;
  DPI:                    string;
  primerNombre:           string;
  primerApellido:         string;
  segundoApellido:        string;
  telefono:               string;
  responsable:            string;
  organizacion:           string;
  idProyecto:             number;
  NombreProyecto:         string;
}

export interface UpdateBeneficiario {
  id:                    number;
  dpi:                 string;
  proyecto:          number;
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

