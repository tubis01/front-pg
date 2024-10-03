
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DatosDetallePersonaList, HateoasResponse } from '../interfaces/persona.interface';

@Injectable({providedIn: 'root'})

export class PersonService {

  private apiUrl: String  = 'http://localhost:8081/api/personas';

  constructor( private http: HttpClient) { }


  public getPersons(page: number = 0, size: number = 20): Observable<HateoasResponse<DatosDetallePersonaList>> {
    return this.http.get<HateoasResponse<DatosDetallePersonaList>>(`${this.apiUrl}/listar?page=${page}&size=${size}`);
  }

    registrarPersona(persona: DatosDetallePersonaList ): Observable<DatosDetallePersonaList> {
    return this.http.post<DatosDetallePersonaList>(`${this.apiUrl}/registrar`, persona);
  }

}
