export interface Person {
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
}

export interface Direccion {
  codigoDepartamento: string;
  nombreDepartamento: string;
  codigoMunicipio:    string;
  comunidad:          string;
  nombreMunicipio:    string;
}

export interface Discapacidad {
  discapacidadAuditiva:   boolean;
  discapacidadMotora:     boolean;
  dicapacidadIntelectual: boolean;
}
