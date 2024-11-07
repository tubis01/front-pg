
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, of, tap } from 'rxjs';
import { Persona, HateoasResponse } from '../interfaces/persona.interface';
import { environments } from '../../../environments/environment';
import { CacheService } from '../../dashboard/services/cache.service';
import { EncryptionService } from '../../services/encription.service';

@Injectable({providedIn: 'root'})

export class PersonService {

  private apiUrl: String  = environments.baseUrl + '/api/personas';

  constructor( private http: HttpClient, private cacheService: CacheService,
    private encr: EncryptionService
  ) { }


  public getPersons(): Observable<HateoasResponse<Persona>> {
    const cacheKey = 'personas_listar'; // Clave de caché genérica sin paginación

    // Verificar si la caché tiene los datos y devolverlos si es así
    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    }
    // Realizar la solicitud HTTP y almacenar el resultado en la caché
    return this.http.get<HateoasResponse<Persona>>(`${this.apiUrl}/listar`).pipe(
      tap(data => this.cacheService.set(cacheKey, data, 300000)) // Almacenar en caché por 5 minutos (300000 ms)
    );
  }

  public getPersonsByUrl(url: string): Observable<HateoasResponse<Persona>> {
    return this.http.get<HateoasResponse<Persona>>(url);
  }

  public updatePerson( persona: Persona): Observable<Persona> {
    const datosEncriptado = this.encr.encryptPayload(persona);
    return this.http.put<Persona>(`${this.apiUrl}/modificar`, datosEncriptado);
  }


  public deletePerson(dpi: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${dpi}`);
  }

  public registrarPersona(persona: Persona ): Observable<Persona> {
    const datosEncriptado = this.encr.encryptPayload(persona)
    console.log(datosEncriptado);
    return this.http.post<Persona>(`${this.apiUrl}/registrar`, datosEncriptado);
  }

  buscarPorDpiParcial(dpi: string, page: number, size: number): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.apiUrl}/buscarDpiParcial?dpi=${dpi}&page=${page}&size=${size}`);
  }



}
