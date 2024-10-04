
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HateoasResponse, Proyecto } from '../interfaces/proyecto.interface';

@Injectable({providedIn: 'root'})
export class ProjectServiceService {

  private apiUrl = 'http://localhost:8081/proyectos'; // Cambiar según la URL real de la API

  constructor(private http: HttpClient) {}

  // Obtener la lista de proyectos activos
  public listarProyectos(page: number = 0, size: number = 20): Observable<HateoasResponse<Proyecto>> {
    return this.http.get<HateoasResponse<Proyecto>>(`${this.apiUrl}/listar?page=${page}&size=${size}`);
  }

  // Obtener la lista de proyectos inactivos
  public listarProyectosInactivos(page: number = 0, size: number = 20): Observable<HateoasResponse<Proyecto>> {
    return this.http.get<HateoasResponse<Proyecto>>(`${this.apiUrl}/inactivos?page=${page}&size=${size}`);
  }

  // Obtener un proyecto por su ID
  public obtenerProyectoPorId(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.apiUrl}/${id}`);
  }

  // Registrar un nuevo proyecto
  public registrarProyecto(datosRegistroProyecto: any): Observable<Proyecto> {
    return this.http.post<Proyecto>(`${this.apiUrl}/registrar`, datosRegistroProyecto);
  }

  // Finalizar (eliminar) un proyecto por su ID
  public finalizarProyecto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/finalizar/${id}`);
  }

  public getProyectoByUrl(url: string): Observable<HateoasResponse<Proyecto>> {
    return this.http.get<HateoasResponse<Proyecto>>(url);
  }

  public updateProyecto(proyecto: Proyecto): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${this.apiUrl}/modificar`, proyecto);
  }
}
