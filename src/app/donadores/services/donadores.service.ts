import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatosDetalleDonadorList, HateoasResponse } from '../interfaces/donador.interface';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DonadoresService {

  apirUrl: string = 'http://localhost:8081/donadores';


  constructor( private http: HttpClient) { }

  public getDonadores(page: number = 0, size: number = 20): Observable<HateoasResponse<DatosDetalleDonadorList>> {
    return this.http.get<HateoasResponse<DatosDetalleDonadorList>>(`${this.apirUrl}/listar?page=${page}&size=${size}`);
  }


  // Agregar un donador
  public addDonador(donador: DatosDetalleDonadorList): Observable<DatosDetalleDonadorList> {
    return this.http.post<DatosDetalleDonadorList>(`${this.apirUrl}/registrar`, donador);
  }

  // Actualizar un donador existente
  public putDonador(donador: DatosDetalleDonadorList): Observable<DatosDetalleDonadorList> {
    return this.http.put<DatosDetalleDonadorList>(`${this.apirUrl}/modificar`, donador);
  }

  // Obtener un donador por ID
  public getDonadorById(id: number): Observable<DatosDetalleDonadorList> {
    return this.http.get<DatosDetalleDonadorList>(`${this.apirUrl}/detalle/${id}`);
  }
    // Eliminar un donador por ID
    public deleteDonador(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apirUrl}/eliminar/${id}`);
    }
}
