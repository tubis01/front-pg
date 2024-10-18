import { Injectable, OnInit } from '@angular/core';
import { Responsable, HateoasResponse } from '../interfaces/responsable.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environments } from '../../../environments/environment';
import { CacheService } from '../../dashboard/services/cache.service';

@Injectable({providedIn: 'root'})
export class ResponsableService {

  private apiUrl: string = environments.baseUrl +  '/responsables';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  public getResponsable(): Observable<HateoasResponse<Responsable>> {
    const cacheKey = `responsables_lista`;

    // Verificar si la caché tiene los datos y devolverlos si es así
    if (this.cacheService.has(cacheKey)) {
      console.log('Datos de responsables obtenidos de la caché');
      return of(this.cacheService.get(cacheKey));
    }

    console.log('Datos de responsables obtenidos del servidor');
    // Realizar la solicitud HTTP y almacenar el resultado en la caché
    return this.http.get<HateoasResponse<Responsable>>(`${this.apiUrl}/listar`).pipe(
      tap(data => this.cacheService.set(cacheKey, data, 300000)) // Almacenar en caché por 5 minutos (300000 ms)
    );
  }


  public getResponsableByUrl(url: string): Observable<HateoasResponse<Responsable>> {
    return this.http.get<HateoasResponse<Responsable>>(url);
  }

  public buscarPorNombre(termi: string, page: number, size: number ): Observable<Responsable[]> {
    const params = new HttpParams()
      .set('term', termi)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Responsable[]>(`${this.apiUrl}/buscarPorNombre`, { params });
  }


  public addResponsable(responsable: Responsable): Observable<Responsable> {
    return this.http.post<Responsable>(`${this.apiUrl}/registrar`, responsable);
  }

  public updateResponsable(responsable: Responsable): Observable<Responsable> {
    return this.http.put<Responsable>(`${this.apiUrl}/modificar`, responsable);
  }

  public deleteResponsable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }


}
