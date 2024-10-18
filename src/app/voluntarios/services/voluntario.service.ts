import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { DatosDetalleVoluntarioList, HateoasResponse } from '../interfaces/voluntario.interface';
import { environments } from '../../../environments/environment';
import { CacheService } from '../../dashboard/services/cache.service';

@Injectable({providedIn: 'root'})
export class VoluntarioService {

  private apiUrl: string = environments.baseUrl + '/voluntarios';

  constructor(private http: HttpClient, private cacheService: CacheService) { }


  // public getVoluntarios(page: number = 0, size: number = 20): Observable<HateoasResponse<DatosDetalleVoluntarioList>> {
  //   const cacheKey = `voluntarios_page_${page}_size_${size}`;

  //   // Verificar si la caché tiene los datos y devolverlos si es así
  //   if (this.cacheService.has(cacheKey)) {
  //     console.log('Datos de voluntarios obtenidos de la caché');

  //     return of(this.cacheService.get(cacheKey));
  //   }
  //   console.log('Datos de voluntarios obtenidos del servidor');


  //   // Realizar la solicitud HTTP y almacenar el resultado en la caché
  //   return this.http.get<HateoasResponse<DatosDetalleVoluntarioList>>(`${this.apiUrl}/listar?page=${page}&size=${size}`).pipe(
  //     tap(data => this.cacheService.set(cacheKey, data, 300000)) // Almacenar en caché por 5 minutos (300000 ms)
  //   );
  // }
  public getVoluntarios(): Observable<HateoasResponse<DatosDetalleVoluntarioList>> {
    const cacheKey = 'voluntarios_lista';

    // Verificar si los datos están en la caché y devolverlos si es así
    if (this.cacheService.has(cacheKey)) {
      console.log('Datos de voluntarios obtenidos de la caché');
      return of(this.cacheService.get(cacheKey));
    }
    console.log('Datos de voluntarios obtenidos del servidor');

    // Realizar la solicitud HTTP y almacenar el resultado en la caché
    return this.http.get<HateoasResponse<DatosDetalleVoluntarioList>>(`${this.apiUrl}/listar`).pipe(
      tap(data => this.cacheService.set(cacheKey, data, 300000)) // Almacenar en la caché por 5 minutos (300000 ms)
    );
  }

  public getVoluntarioByUrl(url: string): Observable<HateoasResponse<DatosDetalleVoluntarioList>> {
    return this.http.get<HateoasResponse<DatosDetalleVoluntarioList>>(url);
  }

    // Agregar un donador
    public addDonador(donador: DatosDetalleVoluntarioList): Observable<DatosDetalleVoluntarioList> {
      return this.http.post<DatosDetalleVoluntarioList>(`${this.apiUrl}/registrar`, donador);
    }


      // Eliminar un donador por ID
      public deleteDonador(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
      }


}
