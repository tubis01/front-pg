export interface HateoasResponse <T>{
  _embedded?: Embedded<T>;
  _links:    Links;
  page:      Page;
}

export interface Embedded<T> {
  datosDetallePersonaList: Persona[];
}

export interface Persona {
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
  genero:                 Genero;
  estadoCivil:            string;
  numeroHijos:            number;
  direccion:              Direccion;
  discapacidad:           Discapacidad;
  comunidadLinguistica:   string;
  area:                   Area;
  cultivo:                string;
  vendeExecedenteCosecha: boolean;
  tipoProductor:          TipoProductor;
  idResponsable:           number;
  responsable:            string;
  idOrganizacion:         number;
  organizacion:           string;
  tipoVivienda:           TipoVivienda;
}

export enum Area {
  Rural = "Rural",
  Urbana = "Urbana",
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

export enum Genero {
  Femenino = "Femenino",
  Masculino = "Masculino",
}

export enum TipoProductor {
  EXCEDENCIA,
  SUSBSISTENCIA,
  INFRASUBSISTENCIA
}


export enum TipoVivienda {
  Alquilada = "Alquilada",
  Cedida = "Cedida",
  Propia = "Propia",
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

