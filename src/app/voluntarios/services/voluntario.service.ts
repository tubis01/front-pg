import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatosDetalleVoluntarioList, HateoasResponse } from '../interfaces/voluntario.interface';

@Injectable({providedIn: 'root'})
export class VoluntarioService {

  private apiUrl: string = 'http://localhost:8081/voluntarios';

  constructor(private http: HttpClient) { }


  public getVoluntarios(page: number = 0, size: number = 20): Observable<HateoasResponse<DatosDetalleVoluntarioList>> {
    return this.http.get<HateoasResponse<DatosDetalleVoluntarioList>>(`${this.apiUrl}/listar?page=${page}&size=${size}`);
  }

  public getVoluntarioByUrl(url: string): Observable<HateoasResponse<DatosDetalleVoluntarioList>> {
    return this.http.get<HateoasResponse<DatosDetalleVoluntarioList>>(url);
  }

    // Agregar un donador
    public addDonador(donador: DatosDetalleVoluntarioList): Observable<DatosDetalleVoluntarioList> {
      return this.http.post<DatosDetalleVoluntarioList>(`${this.apiUrl}/registrar`, donador);
    }

    // Actualizar un donador existente
    public putDonador(donador: DatosDetalleVoluntarioList): Observable<DatosDetalleVoluntarioList> {
      return this.http.put<DatosDetalleVoluntarioList>(`${this.apiUrl}/modificar`, donador);
    }

    // Obtener un donador por ID
    public getDonadorById(id: number): Observable<DatosDetalleVoluntarioList> {
      return this.http.get<DatosDetalleVoluntarioList>(`${this.apiUrl}/detalle/${id}`);
    }
      // Eliminar un donador por ID
      public deleteDonador(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
      }


}
