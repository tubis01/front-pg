
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Persona, HateoasResponse } from '../interfaces/persona.interface';

@Injectable({providedIn: 'root'})

export class PersonService {

  private apiUrl: String  = 'http://localhost:8081/api/personas';

  constructor( private http: HttpClient) { }



  public getPersons(page: number = 0, size: number = 20): Observable<HateoasResponse<Persona>> {
    return this.http.get<HateoasResponse<Persona>>(`${this.apiUrl}/listar?page=${page}&size=${size}`);
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



}
