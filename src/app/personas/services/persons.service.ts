
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, of, tap } from 'rxjs';
import { Persona, HateoasResponse } from '../interfaces/persona.interface';
import { environments } from '../../../environments/environment';
import { CacheService } from '../../dashboard/services/cache.service';

@Injectable({providedIn: 'root'})

export class PersonService {

  private apiUrl: String  = environments.baseUrl + '/api/personas';

  constructor( private http: HttpClient, private cacheService: CacheService) { }



  // public getPersons(page: number = 0, size: number = 20): Observable<HateoasResponse<Persona>> {
  //   const cacheKey = `personas_page_${page}_size_${size}`;

  //   // Verificar si la caché tiene los datos y devolverlos si es así
  //   if (this.cacheService.has(cacheKey)) {
  //     console.log('Datos de personas obtenidos de la caché');

  //     return of(this.cacheService.get(cacheKey));
  //   }
  //   console.log('Datos de personas obtenidos del servidor');


  //   // Realizar la solicitud HTTP y almacenar el resultado en la caché
  //   return this.http.get<HateoasResponse<Persona>>(`${this.apiUrl}/listar?page=${page}&size=${size}`).pipe(
  //     tap(data => this.cacheService.set(cacheKey, data, 300000)) // Almacenar en caché por 5 minutos (300000 ms)
  //   );
  // }

  public getPersons(): Observable<HateoasResponse<Persona>> {
    const cacheKey = 'personas_listar'; // Clave de caché genérica sin paginación

    // Verificar si la caché tiene los datos y devolverlos si es así
    if (this.cacheService.has(cacheKey)) {
      console.log('Datos de personas obtenidos de la caché');
      return of(this.cacheService.get(cacheKey));
    }
    console.log('Datos de personas obtenidos del servidor');

    // Realizar la solicitud HTTP y almacenar el resultado en la caché
    return this.http.get<HateoasResponse<Persona>>(`${this.apiUrl}/listar`).pipe(
      tap(data => this.cacheService.set(cacheKey, data, 300000)) // Almacenar en caché por 5 minutos (300000 ms)
    );
  }


  public getPersonsByUrl(url: string): Observable<HateoasResponse<Persona>> {
    return this.http.get<HateoasResponse<Persona>>(url);
  }

  public updatePerson( persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/modificar`, persona);
  }


  public deletePerson(dpi: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${dpi}`);
  }

    registrarPersona(persona: Persona ): Observable<Persona> {
    return this.http.post<Persona>(`${this.apiUrl}/registrar`, persona);
  }

  buscarPorDpiParcial(dpi: string, page: number, size: number): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.apiUrl}/buscarDpiParcial?dpi=${dpi}&page=${page}&size=${size}`);
  }



}
