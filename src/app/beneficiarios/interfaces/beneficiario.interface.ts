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
  NIT:                    string;
  primerNombre:           string;
  segundoNombre:          string;
  tercerNombre:           string;
  primerApellido:         string;
  segundoApellido:        string;
  telefono:               string;
  fechaNacimiento:        Date;
  etnia:                  string;
  genero:                 string;
  estadoCivil:            string;
  numeroHijos:            number;
  direccion:              Direccion;
  discapacidad:           Discapacidad;
  comunidadLinguistica:   string;
  area:                   string;
  cultivo:                string;
  vendeExecedenteCosecha: boolean;
  tipoProductor:          string;
  responsable:            string;
  organizacion:           string;
  tipoVivienda:           string;
  idProyecto:             number;
  NombreProyecto:         string;
}


export interface Direccion {
  codigoDepartamento: string;
  nombreDepartamento: string;
  codigoMunicipio:    string;
  comunidad:          string;
  nombreMunicipio:    null | string;
}

export interface Discapacidad {
  discapacidadAuditiva:   boolean;
  discapacidadMotora:     boolean;
  dicapacidadIntelectual: boolean;
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

