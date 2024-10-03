import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContarBeneficiariosActivosResponse, ContarProyectosPorEstadoResponse, Estado } from '../interfaces/reporte.types';
import { Observable } from 'rxjs';
import { Proyecto } from '../interfaces/proyecto.interface';

@Injectable({providedIn: 'root'})
export class DashboardService {

  private readonly apiUrl = 'http://localhost:8081/reporte'; // Cambia la URL según la configuración del backend

  constructor(private http: HttpClient) {}

  contarProyectosPorEstado(estado: Estado): Observable<number> {
    const params = new HttpParams().set('estado', estado);
    return this.http.get<number>(`${this.apiUrl}/proyectosPorEstado`, { params });
  }

  contarBeneficiarios(activo: boolean): Observable<number> {
    const params = new HttpParams().set('activo', activo.toString());
    return this.http.get<number>(`${this.apiUrl}/beneficiariosActivos`, { params });
  }

  contarBeneficiariosPorMes(mes: number): Observable<number> {
    const params = new HttpParams().set('mes', mes.toString());
    return this.http.get<number>(`${this.apiUrl}/beneficiariosPorMes`, { params });
  }

  obtenerUltimosProyectosFinalizados(cantidad: number = 5): Observable<Proyecto[]> {
    const params = new HttpParams().set('cantidad', cantidad.toString());
    return this.http.get<Proyecto[]>(`${this.apiUrl}/ultimos-proyectos-finalizados`, { params });
  }

}
