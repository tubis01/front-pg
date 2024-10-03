
export interface Person {
  DPI:                    string;
  NIT:                    string;
  primerNombre:           string;
  segundoNombre:          string;
  tercerNombre:           string;
  primerApellido:         string;
  segundoApellido:        string;
  telefono:               string;
  fechaNacimiento:        string;
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
  tipoProductor:          TipoProductor;
  responsable:            string;
  organizacion:           string;
  tipoVivienda:           string;
  _links:                 Links;
}

export interface Links {
  self:     Eliminar;
  eliminar: Eliminar;
}

export interface Eliminar {
  href: string;
}

export interface Direccion {
  codigoUbicacion:    string;
  comunidad:          string;
  codigoDepartamento: string;
  nombreDepartamento: string;
  codigoMunicipio:    string;
  nombreMunicipio:    string;
  codigo:             string;
}

export interface Discapacidad {
  discapacidadAuditiva:   boolean;
  discapacidadMotora:     boolean;
  dicapacidadIntelectual: boolean;
}


export enum TipoProductor {
  EXCEDENCIA,
  SUSBSISTENCIA,
  INFRASUBSISTENCIA
}
