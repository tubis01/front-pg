
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HateoasResponse, Proyecto } from '../interfaces/proyecto.interface';
import { environments } from '../../../environments/environment';
import { CacheService } from '../../dashboard/services/cache.service';

@Injectable({providedIn: 'root'})
export class ProjectServiceService {

  private apiUrl = environments.baseUrl + '/proyectos'; // Cambiar según la URL real de la API

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  // Obtener la lista de proyectos activos
  public listarProyectos(): Observable<HateoasResponse<Proyecto>> {
    const cacheKey = `proyectos_listar`;

    // Verificar si el caché tiene los datos y devolverlos si es así
    if (this.cacheService.has(cacheKey)) {
      console.log('Datos de proyectos obtenidos de la caché');
      return of(this.cacheService.get(cacheKey));
    }

    console.log('Datos de proyectos obtenidos del servidor');
    // Realizar la solicitud HTTP y almacenar el resultado en la caché
    return this.http.get<HateoasResponse<Proyecto>>(`${this.apiUrl}/listar`).pipe(
      tap(data => this.cacheService.set(cacheKey, data, 300000)) // Almacenar en caché por 5 minutos (300000 ms)
    );
  }

  public buscarPorNombre(termi: string, page: number, size: number ): Observable<Proyecto[]> {
    const params = new HttpParams()
      .set('term', termi)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Proyecto[]>(`${this.apiUrl}/buscarPorNombre`, { params });
  }

  // Obtener la lista de proyectos inactivos
  public listarProyectosInactivos(page: number = 0, size: number = 20): Observable<HateoasResponse<Proyecto>> {
    return this.http.get<HateoasResponse<Proyecto>>(`${this.apiUrl}/inactivos?page=${page}&size=${size}`);
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
