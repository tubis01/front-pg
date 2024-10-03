export enum Estado {
  EnProceso = 'En_proceso',
  Finalizado = 'Finalizado',
}

export interface ReporteBeneficiariosPorMes {
  mes: number;
  cantidad: number;
}

export interface ContarProyectosPorEstadoResponse {
  cantidad: number;
}

export interface ContarBeneficiariosActivosResponse {
  cantidad: number;
}

export interface ResponseCantidad{
  cantidad: number;
}
